import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    NgModule
} from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { S_UI_CHECKOUT_PROVIDER } from '../injection-tokens/checkout.token';
import { CheckoutProvider } from '../models';
import { AddToBasketDirectiveModule } from '../primitives/add-to-basket/add-to-basket.directive';
import { CheckoutDirectiveModule } from '../primitives/checkout/checkout.directive';
import { ItemDirectiveModule } from '../primitives/item/item.directive';
import { RemoveFromBasketModule } from '../primitives/remove-from-basket';
import { BasketStore } from '../stores/basket-store/basket.store';
import { StripeCheckoutStore } from '../stores/checkouts/stripe-checkout';
import { ItemStore } from '../stores/item-store/item.store';
import { ShopStore } from '../stores/shop-store/shop.store';
import { Unsubscribe, UnsubscribeModule } from '../utils/angular/unsubscribe';

const DEV_STRIPE_KEY =
    'pk_test_51L6xQsKBi9YpHhPG8Txhae1QMc9W2OKk8NoYXcGbyEV1KV1HdggRkuy1mOueulSFhHSmHb8nxhLQtLC4MNtl0u8m00EIcSMkgL';

@Component({
    selector: 's-example-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent extends Unsubscribe {
    @Input() price = 0;

    /**
     * Constructor for ItemComponent
     * @param shopStore the shopStore
     * @param basketStore the basketStore
     * @param itemStore the itemStore
     */
    constructor(
        public shopStore: ShopStore,
        public basketStore: BasketStore,
        public itemStore: ItemStore,
        @Inject(S_UI_CHECKOUT_PROVIDER)
        private checkoutProvider: StripeCheckoutStore
    ) {
        super();
        this.checkoutProvider.setupStripe(DEV_STRIPE_KEY);
    }
}

@NgModule({
    imports: [
        CommonModule,
        TuiButtonModule,
        UnsubscribeModule,
        AddToBasketDirectiveModule,
        RemoveFromBasketModule,
        ItemDirectiveModule,
        CheckoutDirectiveModule
    ],
    providers: [
        { provide: S_UI_CHECKOUT_PROVIDER, useClass: StripeCheckoutStore },
        BasketStore,
        ShopStore,
        ItemStore
    ],
    declarations: [ItemComponent],
    exports: [ItemComponent]
})
export class ItemComponentModule {}
