import { Directive, HostListener, Input, NgModule } from '@angular/core';
import { tuiAssert } from '@taiga-ui/cdk';
import { Subject, tap, withLatestFrom } from 'rxjs';
import { BasketStore } from '../../stores/basket-store/basket.store';
import { ItemStore } from '../../stores/item-store/item.store';
import {
    Unsubscribe,
    UnsubscribeModule
} from '../../utils/angular/unsubscribe';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[s-remove-from-basket]'
})
export class RemoveFromBasketDirective extends Unsubscribe {
    private readonly removeFromBasket$ = new Subject<void>();

    /**
     * Removes the current item from the basket
     */
    private readonly removeFromBasket = this.removeFromBasket$.pipe(
        withLatestFrom(this.itemStore.itemId$),
        tap(([, itemId]) => {
            tuiAssert.assert(
                itemId !== null,
                'Cannot remove a null itemId from the basket'
            );
            if (itemId !== null) {
                this.basketStore.removeItem({
                    itemId,
                    ignoreQuantity: this.sIgnoreQuantity
                });
            }
        })
    );

    @Input() sIgnoreQuantity = false;

    /**
     * Remove the current item from the basket when the host element is clicked
     */
    @HostListener('click') click(): void {
        this.removeFromBasket$.next();
    }

    /**
     * Constructor for RemoveFromBasketDirective
     */
    constructor(
        private basketStore: BasketStore,
        private itemStore: ItemStore
    ) {
        super();
        this.removeFromBasket.subscribe();
    }
}

@NgModule({
    imports: [UnsubscribeModule],
    declarations: [RemoveFromBasketDirective],
    exports: [RemoveFromBasketDirective]
})
export class RemoveFromBasketModule {}
