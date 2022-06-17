import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
    loadStripe,
    RedirectToCheckoutClientOptions,
    Stripe
} from '@stripe/stripe-js';
import { exhaustMap, filter, pipe, withLatestFrom } from 'rxjs';
import { EventState } from '../../../enums';
import { CheckoutOptions, CheckoutProvider } from '../../../models';
import { DeepPartial } from '../../../utils/models/deep-partial.model';

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
    implements CheckoutProvider<DeepPartial<RedirectToCheckoutClientOptions>>
{
    /**
     * The stripe instance. Only emits a value when stripe is setup
     */
    private readonly stripe$ = this.select(({ stripe }) => stripe).pipe(
        filter(Boolean)
    );

    /**
     * Checkout with the passed items and options
     * @param checkoutOptions the options to checkout with
     */
    public readonly checkout = this.effect<
        CheckoutOptions<DeepPartial<RedirectToCheckoutClientOptions>>
    >(
        pipe(
            withLatestFrom(this.stripe$),
            exhaustMap(([{ items }, stripe]) =>
                stripe.redirectToCheckout({
                    lineItems: items.map(({ itemId, quantity }) => ({
                        price: itemId,
                        quantity
                    })),
                    mode: 'payment',
                    successUrl: window.location.origin,
                    cancelUrl: window.location.origin
                })
            )
        )
    );

    /**
     * Sets up stripe with the given stipe key
     * @param stripeKey the stripe key to use
     * @returns a boolean indicating if stripe wa setup correctly
     */
    async setupStripe(stripeKey: string): Promise<boolean> {
        const stripe = await loadStripe(stripeKey);

        if (!stripe) {
            this.patchState({ stripeState: EventState.ERROR });
            return false;
        }

        this.patchState({ stripe, stripeState: EventState.OK });
        return true;
    }

    /**
     * Constructor for StripeCheckoutStore
     */
    constructor() {
        super(DEFAULT_STATE);
    }
}
