import {
    Directive,
    HostListener,
    Inject,
    Input,
    NgModule
} from '@angular/core';
import { Subject, takeUntil, tap, withLatestFrom } from 'rxjs';
import { S_UI_CHECKOUT_PROVIDER } from '../../injection-tokens/checkout.token';
import {
    CheckoutProvider,
    CheckoutWithOptions,
    CheckoutWithoutOptions
} from '../../models';
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
        tap(([, items]) => {
            if (
                items === null &&
                (typeof this.checkoutOptions === 'string' ||
                    !this.checkoutOptions?.items)
            ) {
                return;
            }

            this.checkoutProvider.checkout({
                items,
                ...(this.checkoutOptions ?? {})
            });
        }),
        takeUntil(this.destroy$)
    );

    /**
     * The options to use at checkout
     */
    @Input('s-checkout') checkoutOptions:
        | CheckoutWithoutOptions
        | Partial<CheckoutWithOptions<unknown>>
        | null
        | '' = null;

    /**
     * Redirects the user to the checkout
     */
    @HostListener('click') click(): void {
        this.checkout$.next();
    }

    /**
     * Constructor for the CheckoutDirective
     * @param basketStore the BasketStore
     */
    constructor(
        private basketStore: BasketStore,
        @Inject(S_UI_CHECKOUT_PROVIDER)
        private checkoutProvider: CheckoutProvider
    ) {
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
