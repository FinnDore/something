import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';

export interface BasketStoreState {
    items: Item[];
}

const DEFAULT_STATE: BasketStoreState = {
    items: []
};

export class BasketStore extends ComponentStore<BasketStoreState> {
    /**
     * A list of items in the basket
     */
    public readonly items$ = this.select(({ items }) => items);

    /**
     * Returns an an item given its id
     * @param itemId the id of the item to return
     * @returns the requested item
     */
    public getItem(itemId: string): Observable<Item | null> {
        return this.select(
            ({ items }) => items.find((item) => item?.id === itemId) ?? null
        );
    }

    /**
     * Constructor for BasketStore
     */
    constructor() {
        super(DEFAULT_STATE);
    }
}
