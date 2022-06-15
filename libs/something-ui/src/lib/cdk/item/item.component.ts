import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule
} from '@angular/core';
import { LetModule, ReactiveComponentModule } from '@ngrx/component';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { TuiButtonModule } from '@taiga-ui/core';
import { take } from 'rxjs';
import { ItemStore } from '../stores/item-store/item.store';
import { AddToBasketDirectiveModule } from '../primitives/add-to-basket/add-to-basket.directive';
import { ItemDirectiveModule } from '../primitives/item/item.directive';
import { BasketStore } from '../stores/basket-store/basket.store';
import { ShopStore } from '../stores/shop-store/shop.store';
import { Unsubscribe, UnsubscribeModule } from '../utils/angular/unsubscribe';
import { log } from '../utils/rx/log';
import { RemoveFromBasketModule } from '../primitives/remove-from-basket';
import { CheckoutDirectiveModule } from '../primitives/checkout/checkout.directive';

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
        public itemStore: ItemStore
    ) {
        super();
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
    providers: [BasketStore],
    declarations: [ItemComponent],
    exports: [ItemComponent]
})
export class ItemComponentModule {}
