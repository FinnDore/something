import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { addItemReducer } from './_reducers/add-item.reducer';
import { removeItemReducer } from './_reducers/remove-item.reducer';

export interface BasketStoreState {
    items: {
        quantity: number;
        itemId: string;
    }[];
}

const DEFAULT_STATE: BasketStoreState = {
    items: []
};

@Injectable()
export class BasketStore extends ComponentStore<BasketStoreState> {
    /**
     * A list of item ids in the basket
     */
    public readonly items$ = this.select(({ items }) => items);

    /**
     * Adds an item or items to the basket
     * @param itemId the itemId or ids of the item to add
     */
    public readonly addItem = this.updater(addItemReducer);

    /**
     * Removes an item or items from  the basket
     * @param itemId the itemId or ids of the item to remove
     */
    public readonly removeItem = this.updater(removeItemReducer);

    /**
     * Constructor for BasketStore
     */
    constructor() {
        super(DEFAULT_STATE);
    }
}
