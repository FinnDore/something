import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule
} from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { AddToBasketDirectiveModule } from '../primitives/add-to-basket/add-to-basket.directive';
import { CheckoutDirectiveModule } from '../primitives/checkout/checkout.directive';
import { ItemDirectiveModule } from '../primitives/item/item.directive';
import { RemoveFromBasketModule } from '../primitives/remove-from-basket';
import { BasketStore } from '../stores/basket-store/basket.store';
import { ItemStore } from '../stores/item-store/item.store';
import { ShopStore } from '../stores/shop-store/shop.store';
import { Unsubscribe, UnsubscribeModule } from '../utils/angular/unsubscribe';

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
