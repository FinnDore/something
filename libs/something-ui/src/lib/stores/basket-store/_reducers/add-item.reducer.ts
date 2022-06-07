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
    const newItems = [...state.items];
    for (const currentItemId of typeof itemId === 'string'
        ? [itemId]
        : itemId) {
        const existingItem = newItems.find((x) => x.itemId === itemId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            newItems.push({ itemId: currentItemId, quantity: 0 });
        }
    }

    return { ...state, items: newItems };
}
