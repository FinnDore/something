import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { of, switchMap } from 'rxjs';
import { ShopStore } from '../shop-store/shop.store';

export interface ItemStoreState {
    selectedItemId: string | null;
}

const DEFAULT_STATE: ItemStoreState = {
    selectedItemId: null
};

@Injectable()
export class ItemStore extends ComponentStore<ItemStoreState> {
    /**
     * The current item id
     */
    public readonly itemId$ = this.select(
        ({ selectedItemId }) => selectedItemId
    );
    /**
     * The current item
     */
    public readonly item$ = this.itemId$.pipe(
        switchMap((selectedItemId) =>
            selectedItemId !== null
                ? this.shopStore.getItem(selectedItemId)
                : of(null)
        )
    );

    /**
     * Constructor for UtilsasketStore
     */
    constructor(private shopStore: ShopStore) {
        super(DEFAULT_STATE);
    }
}
