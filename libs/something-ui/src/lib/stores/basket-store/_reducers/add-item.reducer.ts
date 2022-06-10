import { BasketStoreState } from '../basket.store';

export type itemInput = string | { itemId: string; quantity: number };

/**
 * Adds and item to the basket
 * @param state the current state
 * @param itemId the item id to add
 * @returns the updated state
 */
export function addItemReducer(
    state: BasketStoreState,
    itemId: itemInput | itemInput[]
): BasketStoreState {
    const newItems = [...state.items];
    for (const currentItem of getItemsToAdd(itemId)) {
        const existingItem = newItems.find(
            x => x.itemId === currentItem.itemId
        );

        if (existingItem) {
            existingItem.quantity += currentItem.quantity;
        } else {
            newItems.push(currentItem);
        }
    }

    return { ...state, items: newItems };
}

/**
 * Takes the itemId input and turns it into a consistent format
 * @param itemId the itemId input
 * @returns the itemId input in a consistent format
 */
function getItemsToAdd(
    itemId: itemInput | itemInput[]
): { itemId: string; quantity: number }[] {
    if (!Array.isArray(itemId)) {
        return [typeof itemId === 'string' ? { quantity: 1, itemId } : itemId];
    }

    if (!itemId.length) {
        return [];
    }

    return itemId.map(currentItem =>
        typeof currentItem === 'string'
            ? {
                  quantity: 1,
                  itemId: currentItem
              }
            : currentItem
    );
}
