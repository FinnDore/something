import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { addItemReducer } from './_reducers/add-item.reducer';

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
     * A list of item id's in the basket
     */
    public readonly items$ = this.select(({ items }) => items);

    /**
     * Adds and item or items to the basket
     * @param itemId the item id or ids of the item to add
     */
    public readonly addItem = this.updater(addItemReducer);

    /**
     * Constructor for BasketStore
     */
    constructor() {
        super(DEFAULT_STATE);
    }
}
