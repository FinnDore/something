import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { addItem } from './_reducers/add-item.reducer';

export interface UtilsasketStoreState {
    items: {
        quantity: number;
        itemId: string;
    }[];
}

const DEFAULT_STATE: UtilsasketStoreState = {
    items: []
};

@Injectable()
export class UtilsasketStore extends ComponentStore<UtilsasketStoreState> {
    /**
     * A list of item id's in the basket
     */
    public readonly items$ = this.select(({ items }) => items);

    /**
     * Adds and item or items to the basket
     * @param itemId the item id or ids of the item to add
     */
    public readonly addItem = this.updater(addItem);

    /**
     * Constructor for UtilsasketStore
     */
    constructor() {
        super(DEFAULT_STATE);
    }
}
