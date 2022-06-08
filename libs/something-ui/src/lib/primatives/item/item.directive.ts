/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { Directive, Input, NgModule } from '@angular/core';
import { ItemStore } from '../../stores/item-store/item.store';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[s-item]',
    providers: [ItemStore]
})
export class ItemDirective {
    /**
     *
     * @param selectedItemId the current item
     */
    @Input('s-item') set item(selectedItemId: string) {
        this.itemStore.patchState({ selectedItemId: selectedItemId });
    }

    /**
     * Constructor for ItemDirective
     */
    constructor(private itemStore: ItemStore) {}
}

@NgModule({
    imports: [CommonModule],
    declarations: [ItemDirective],
    exports: [ItemDirective]
})
export class ItemDirectiveModule {}
