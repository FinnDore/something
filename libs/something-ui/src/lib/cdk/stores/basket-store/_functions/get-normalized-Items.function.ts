import { ItemInput } from '../_models/item-input.model';

/**
 * Takes the itemInput and turns it into a consistent format
 * @param itemId the itemId input
 * @returns the itemInput input in a consistent format
 */
export function getNormalizedItems(
    itemId: ItemInput | ItemInput[]
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
