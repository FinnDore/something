import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
    loadStripe,
    RedirectToCheckoutClientOptions,
    Stripe
} from '@stripe/stripe-js';
import {
    defaultIfEmpty,
    exhaustMap,
    filter,
    map,
    Observable,
    pipe,
    Subject,
    switchMap,
    take,
    takeUntil
} from 'rxjs';
import { EventState } from '../../../enums';
import {
    CheckoutOptions,
    CheckoutProvider,
    CheckoutWithOptions
} from '../../../models';

export interface StripeCheckoutStoreState {
    stripe: Stripe | null;
    stripeState: EventState;
}

const DEFAULT_STATE: StripeCheckoutStoreState = {
    stripe: null,
    stripeState: EventState.INIT
};

@Injectable()
export class StripeCheckoutStore
    extends ComponentStore<StripeCheckoutStoreState>
    implements CheckoutProvider<RedirectToCheckoutClientOptions>
{
    private readonly flushStripe$ = new Subject<void>();

    /**
     * The stripe instance. Only emits a value when stripe is setup
     */
    protected stripe$ = this.getStripe();

    /**
     * Checkout with the passed items and options
     * @param checkoutOptions the options to checkout with
     */
    public readonly checkout = this.effect<
        CheckoutOptions<RedirectToCheckoutClientOptions>
    >(
        pipe(
            filter(({ items }) => !!items),
            // We use a switch map here so if stripe is set to null we block here for another
            // stripe instance rather than using a stale stripe instance
            switchMap(this.getStripeForCheckout),
            filter(Boolean),
            exhaustMap(([checkoutOptions, stripe]) =>
                stripe.redirectToCheckout({
                    mode: 'payment',
                    successUrl: window.location.origin,
                    cancelUrl: window.location.origin,
                    ...((
                        checkoutOptions as CheckoutWithOptions<RedirectToCheckoutClientOptions>
                    ).options ?? {}),
                    lineItems: checkoutOptions.items.map(
                        ({ itemId, quantity }) => ({
                            price: itemId,
                            quantity
                        })
                    )
                })
            )
        )
    );

    /**
     * Sets up stripe with the given stipe key
     * @param stripeKey the stripe key to use
     * @returns a boolean indicating if stripe wa setup correctly
     */
    public async setupStripe(stripeKey: string): Promise<boolean> {
        const stripe = await loadStripe(stripeKey);

        if (!stripe) {
            this.patchState({ stripeState: EventState.ERROR });
            return false;
        }

        this.patchState({ stripe, stripeState: EventState.OK });
        this.stripe$ = this.getStripe();
        this.flushStripe$.next();
        return true;
    }

    /**
     * Creates and returns a selector for the stripe object
     * @Returns an observable that emits a stripe
     */
    public getStripe(): Observable<Stripe> {
        return this.select(({ stripe }) => stripe).pipe(filter(Boolean));
    }

    /**
     * Returns an observable with the checkout options and a stripe object once before completing.
     * Note that observable completes when flushStripe emits. This means it could complete without any values being emitted
     * @param opts the checkout options
     * @returns returns an observable with the past ops and a stripe object
     */
    private getStripeForCheckout<
        T = CheckoutOptions<RedirectToCheckoutClientOptions>
    >(opts: T): Observable<[T, Stripe] | null> {
        return this.stripe$.pipe(
            map((stripe): [T, Stripe] => [opts, stripe]),
            take(1),
            takeUntil(this.flushStripe$),
            defaultIfEmpty(null)
        );
    }

    /**
     * Constructor for StripeCheckoutStore
     */
    constructor() {
        super(DEFAULT_STATE);
    }
}
