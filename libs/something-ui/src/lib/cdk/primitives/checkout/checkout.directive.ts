import { Directive, HostListener, NgModule } from '@angular/core';
import { loadStripe, StripeError } from '@stripe/stripe-js';
import { exhaustMap, of, Subject, takeUntil, withLatestFrom } from 'rxjs';
import { BasketItem } from '../../models/basket-item.model';
import { BasketStore } from '../../stores/basket-store';
import {
    Unsubscribe,
    UnsubscribeModule
} from '../../utils/angular/unsubscribe';

// TODO provide a way of injecting this at runtime
const DEV_STRIPE_KEY =
    'pk_test_51L6xQsKBi9YpHhPG8Txhae1QMc9W2OKk8NoYXcGbyEV1KV1HdggRkuy1mOueulSFhHSmHb8nxhLQtLC4MNtl0u8m00EIcSMkgL';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[s-checkout]'
})
export class CheckoutDirective extends Unsubscribe {
    private readonly checkout$ = new Subject<void>();

    /**
     * Checkout with the current items in the basket
     */
    private readonly checkout = this.checkout$.pipe(
        withLatestFrom(this.basketStore.items$),
        exhaustMap(([, items]) => {
            if (items === null) {
                return of(null);
            }

            return this.redirectToCheckout(items);
        }),
        takeUntil(this.destroy$)
    );

    /**
     * Redirects the user to the checkout
     */
    @HostListener('click') click(): void {
        this.checkout$.next();
    }

    /**
     * Redirects the user to the checkout
     * @param items the items to checkout with
     */
    async redirectToCheckout(items: BasketItem[]): Promise<{
        error: StripeError;
    } | void> {
        const stripe = await loadStripe(DEV_STRIPE_KEY);

        if (!stripe) {
            return;
        }

        return await stripe.redirectToCheckout({
            lineItems: items.map(({ itemId, quantity }) => ({
                price: itemId,
                quantity
            })),
            mode: 'payment',
            successUrl: `${window.location.origin}`,
            cancelUrl: `${window.location.origin}`
        });
    }

    /**
     * Constructor for the CheckoutDirective
     * @param basketStore the BasketStore
     */
    constructor(private basketStore: BasketStore) {
        super();
        this.checkout.subscribe();
    }
}

@NgModule({
    imports: [UnsubscribeModule],
    declarations: [CheckoutDirective],
    exports: [CheckoutDirective]
})
export class CheckoutDirectiveModule {}
