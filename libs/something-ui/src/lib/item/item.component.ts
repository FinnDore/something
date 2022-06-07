import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule
} from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { TuiButtonModule } from '@taiga-ui/core';
import { take } from 'rxjs';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { log, Unsubscribe, UnsubscribeModule } from '../../../../utils/src';
import { BasketStore } from '../basket-store/basket.store';
import { ItemStore } from '../stores/item-store/item.store';
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

    private stripe: Stripe | null = null;
    /**
     *
     */
    async setUp(): Promise<void> {
        this.stripe = await loadStripe(
            'pk_test_51L6xQsKBi9YpHhPG8Txhae1QMc9W2OKk8NoYXcGbyEV1KV1HdggRkuy1mOueulSFhHSmHb8nxhLQtLC4MNtl0u8m00EIcSMkgL'
        );
        this.shopStore.patchState({
            items: [
                {
                    id: 'price_1L88f0KBi9YpHhPGJnB4uxjX'
                }
            ]
        });
        this.itemStore.patchState({
            selectedItemId: 'price_1L88f0KBi9YpHhPGJnB4uxjX'
        });
        this.itemStore.item$.pipe(log()).subscribe();
    }

    /** */
    async checkout(): Promise<void> {
        console.log(this.stripe);
        if (!this.stripe) {
            console.log('no stripe');
            return;
        }

        const items = await this.basketStore.items$.pipe(take(1)).toPromise();
        if (!items) {
            return;
        }
        await this.stripe.redirectToCheckout({
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
