import { ComponentStore } from '@ngrx/component-store';
import { ShopStore } from '../shop-store/shop.store';

export interface ItemStoreState {
    selectedItemId: string | null;
}

const DEFAULT_STATE: ItemStoreState = {
    selectedItemId: null
};

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
    public readonly item$ = this.select(({ selectedItemId }) =>
        selectedItemId !== null ? this.shopStore.getItem(selectedItemId) : null
    );

    /**
     * Constructor for BasketStore
     */
    constructor(private shopStore: ShopStore) {
        super(DEFAULT_STATE);
    }
}
