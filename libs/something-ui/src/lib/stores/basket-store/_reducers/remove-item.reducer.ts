import { BasketStoreState } from '../basket.store';
import { getNormalizedItems } from '../_functions/get-normalized-Items.function';
import { itemInput } from '../_models/item-input.model';

type InputWithConfig = {
    itemId: itemInput | itemInput[];
    ignoreQuantity: boolean;
};

/**
 * Removes and item from the basket
 * @param state the current state
 * @param itemId the item id to add
 * @returns the updated state
 */
export function removeItemReducer(
    state: BasketStoreState,
    itemId: itemInput | itemInput[] | InputWithConfig
): BasketStoreState {
    const newItems = [...state.items];
    let ignoreQuantity = false;
    let extractedItemIds: itemInput | itemInput[] = [];

    // Strip potential config values
    if (typeof itemId === 'string') {
        extractedItemIds = itemId;
    } else if (Array.isArray(itemId)) {
        extractedItemIds = itemId;
    } else if ('ignoreQuantity' in itemId) {
        extractedItemIds = itemId.itemId;
        ignoreQuantity = itemId.ignoreQuantity;
    } else {
        extractedItemIds = itemId;
    }

    for (const currentItem of getNormalizedItems(extractedItemIds)) {
        const itemIndex = newItems.findIndex(
            x => x.itemId === currentItem.itemId
        );

        if (itemIndex === -1) {
            continue;
        }

        if (
            ignoreQuantity ||
            newItems[itemIndex].quantity - currentItem.quantity <= 0
        ) {
            newItems.splice(itemIndex, 1);
        } else {
            newItems[itemIndex].quantity -= currentItem.quantity;
        }
    }

    return { ...state, items: newItems };
}
