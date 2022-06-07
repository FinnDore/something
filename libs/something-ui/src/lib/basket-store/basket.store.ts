import { ComponentStore } from '@ngrx/component-store';
import { addItem } from './_reducers/add-item.reducer';

export interface BasketStoreState {
    items: string[];
}

const DEFAULT_STATE: BasketStoreState = {
    items: []
};

export class BasketStore extends ComponentStore<BasketStoreState> {
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
     * Constructor for BasketStore
     */
    constructor() {
        super(DEFAULT_STATE);
    }
}
