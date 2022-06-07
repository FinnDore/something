/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { Directive, HostListener, NgModule } from '@angular/core';
import { Subject, tap, withLatestFrom } from 'rxjs';
import { BasketStore } from '../../basket-store/basket.store';
import { ItemStore } from '../../stores/item-store/item.store';
import { log, Unsubscribe, UnsubscribeModule } from '@something/utils';

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
        tap(
            ([, itemId]) => itemId !== null && this.basketStore.addItem(itemId)
        ),
        log()
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
