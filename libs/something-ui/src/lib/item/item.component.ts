import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule
} from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule } from '@taiga-ui/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { log, Unsubscribe, UnsubscribeModule } from '../../../../utils/src';
import { BasketStore } from '../basket-store/basket.store';
import { ItemStore } from '../item-store/item.store';
import { AddToBasketDirectiveModule } from '../primatives/add-to-basket/add-to-basket.directive';
import { ShopStore } from '../shop-store/shop.store';

@Component({
    selector: 's-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent extends Unsubscribe {
    @Input() price = 0;
    /**
     *
     */
    async setUp(): Promise<void> {
        this.shopStore.patchState({
            items: [
                {
                    id: '1'
                }
            ]
        });
        this.itemStore.patchState({
            selectedItemId: '1'
        });
        this.itemStore.item$.pipe(log()).subscribe();
    }

    /**
     *
     */
    constructor(
        public shopStore: ShopStore,
        public basketStore: BasketStore,
        public itemStore: ItemStore
    ) {
        super();
        this.setUp();
    }
}

@NgModule({
    imports: [
        CommonModule,
        TuiButtonModule,
        ReactiveComponentModule,
        UnsubscribeModule,
        AddToBasketDirectiveModule
    ],
    declarations: [ItemComponent],
    exports: [ItemComponent]
})
export class ItemComponentModule {}
