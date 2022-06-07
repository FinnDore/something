import {
    ChangeDetectorRef,
    Directive,
    HostListener,
    inject,
    NgModule
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, tap, withLatestFrom } from 'rxjs';
import { ItemStore } from '../../item-store/item.store';
import { BasketStore } from '../../basket-store/basket.store';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[s-add-to-basket]'
})
export class AddToBasketDirective {
    private readonly addToBasket$ = new Subject<void>();

    /**
     * Add the current item to the basket
     */
    private readonly addToBasket = this.addToBasket$.pipe(
        withLatestFrom(this.itemStore.itemId$),
        tap(([, itemId]) => itemId !== null && this.basketStore.addItem(itemId))
        // takeUntil(inject(ChangeDetectorRef).de)
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
        this.addToBasket.subscribe();
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [AddToBasketDirective],
    exports: [AddToBasketDirective]
})
export class AddToBasketDirectiveModule {}
