/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { Directive, HostListener, NgModule } from '@angular/core';
import { Subject, tap, withLatestFrom } from 'rxjs';
import { ItemStore } from '../../stores/item-store/item.store';
import { log, Unsubscribe, UnsubscribeModule } from '@something/utils';
import { BasketStore } from '../../stores/basket-store/basket.store';
import { tuiAssert } from '@taiga-ui/cdk';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[s-add-to-basket]'
})
export class AddToBasketDirective extends Unsubscribe {
    private readonly addToBasket$ = new Subject<void>();

    /**
     * Add the current item to the basket
     */
    private readonly addToBasket = this.addToBasket$.pipe(
        withLatestFrom(this.itemStore.itemId$),
        tap(([, itemId]) => {
            tuiAssert.assert(
                itemId !== null,
                'Cannot add a null itemId to the basket'
            );
            if (itemId !== null) {
                this.basketStore.addItem(itemId);
            }
        })
    );

    /**
     * Add the current item to the basket when the host element is clicked
     */
    @HostListener('click') click(): void {
        this.addToBasket$.next();
    }

    /**
     * Constructor for AddToBasketDirective
     */
    constructor(
        private basketStore: BasketStore,
        private itemStore: ItemStore
    ) {
        super();
        this.addToBasket.subscribe();
    }
}

@NgModule({
    imports: [CommonModule, UnsubscribeModule],
    declarations: [AddToBasketDirective],
    exports: [AddToBasketDirective]
})
export class AddToBasketDirectiveModule {}
