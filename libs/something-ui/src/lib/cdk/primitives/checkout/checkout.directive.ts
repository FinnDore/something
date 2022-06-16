import { Directive, HostListener, NgModule } from '@angular/core';
import { StripeError } from '@stripe/stripe-js';
import { exhaustMap, of, Subject, takeUntil, withLatestFrom } from 'rxjs';
import { BasketItem } from '../../models/basket-item.model';
import { BasketStore } from '../../stores/basket-store';
import {
    Unsubscribe,
    UnsubscribeModule
} from '../../utils/angular/unsubscribe';

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
    } | void> {}

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
