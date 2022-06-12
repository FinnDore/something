import { BasketStoreState } from '../basket.store';
import { getNormalizedItems } from '../_functions/get-normalized-Items.function';
import { ItemInput } from '../_models/item-input.model';

/**
 * Adds and item to the basket
 * @param state the current state
 * @param itemId the item id to add
 * @returns the updated state
 */
export function addItemReducer(
    state: BasketStoreState,
    itemId: ItemInput | ItemInput[]
): BasketStoreState {
    const newItems = [...state.items];
    for (const currentItem of getNormalizedItems(itemId)) {
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
