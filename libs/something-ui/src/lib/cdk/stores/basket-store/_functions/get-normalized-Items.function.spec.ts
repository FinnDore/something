import { ItemInput } from '../_models/item-input.model';
import { getNormalizedItems } from './get-normalized-Items.function';

describe('getNormalizedItems', () => {
    it('should normalize a string', () => {
        const item: ItemInput = '1';
        expect(getNormalizedItems(item)).toEqual([
            { itemId: '1', quantity: 1 }
        ]);
    });

    it('should normalize a object', () => {
        const item: ItemInput = { itemId: '1', quantity: 1 };
        expect(getNormalizedItems(item)).toEqual([
            { itemId: '1', quantity: 1 }
        ]);
    });

    it('should normalize a object with a non 1 quantity', () => {
        const item: ItemInput = { itemId: '1', quantity: 5 };
        expect(getNormalizedItems(item)).toEqual([
            { itemId: '1', quantity: 5 }
        ]);
    });

    it('should normalize a list of strings', () => {
        const items: ItemInput[] = ['1', '2', '3', '1'];
        expect(getNormalizedItems(items)).toEqual([
            { itemId: '1', quantity: 1 },
            { itemId: '2', quantity: 1 },
            { itemId: '3', quantity: 1 },
            { itemId: '1', quantity: 1 }
        ]);
    });

    it('should normalize a list of objects', () => {
        const items: ItemInput[] = [
            { itemId: '1', quantity: 1 },
            { itemId: '2', quantity: 5 },
            { itemId: '3', quantity: 4 },
            { itemId: '4', quantity: 2 }
        ];
        expect(getNormalizedItems(items)).toEqual([
            { itemId: '1', quantity: 1 },
            { itemId: '2', quantity: 5 },
            { itemId: '3', quantity: 4 },
            { itemId: '4', quantity: 2 }
        ]);
    });

    it('should normalize a list of objects and ids', () => {
        const items: ItemInput[] = [
            { itemId: '1', quantity: 1 },
            '2',
            { itemId: '3', quantity: 4 },
            '4'
        ];
        expect(getNormalizedItems(items)).toEqual([
            { itemId: '1', quantity: 1 },
            { itemId: '2', quantity: 1 },
            { itemId: '3', quantity: 4 },
            { itemId: '4', quantity: 1 }
        ]);
    });
});
