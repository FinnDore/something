import { BasketStoreState } from '../basket.store';

// eslint-disable-next-line valid-jsdoc
/**
 * Adds and item to the basket
 * @param state the current state
 * @param itemId the item id to add
 */
export function addItem(
    state: BasketStoreState,
    itemId: string | string[]
): BasketStoreState {
    const items =
        typeof itemId === 'string'
            ? [...state.items, itemId]
            : [...state.items, ...itemId];
    return { ...state, items };
}
