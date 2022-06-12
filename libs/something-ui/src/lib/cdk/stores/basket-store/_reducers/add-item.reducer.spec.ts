import { BasketStoreState } from '../basket.store';
import { addItemReducer } from './add-item.reducer';

describe('addItemReducer', () => {
    it('should add the given item to the basket with the given id', () => {
        let currentState: BasketStoreState = {
            items: []
        };

        currentState = addItemReducer(currentState, '1');

        expect(currentState).toEqual<BasketStoreState>({
            items: [{ itemId: '1', quantity: 1 }]
        });

        currentState = addItemReducer(currentState, '1');

        expect(currentState).toEqual<BasketStoreState>({
            items: [{ itemId: '1', quantity: 2 }]
        });

        currentState = addItemReducer(currentState, ['1', '1']);
        expect(currentState).toEqual<BasketStoreState>({
            items: [{ itemId: '1', quantity: 4 }]
        });

        currentState = addItemReducer(currentState, ['1', '2', '1', '2']);

        expect(currentState).toEqual<BasketStoreState>({
            items: [
                { itemId: '1', quantity: 6 },
                { itemId: '2', quantity: 2 }
            ]
        });
    });

    it('should add the given item to the basket with the given id and quantity or just and id', () => {
        let currentState: BasketStoreState = {
            items: []
        };

        currentState = addItemReducer(currentState, {
            itemId: '1',
            quantity: 1
        });

        expect(currentState).toEqual<BasketStoreState>({
            items: [{ itemId: '1', quantity: 1 }]
        });

        currentState = addItemReducer(currentState, {
            itemId: '1',
            quantity: 2
        });

        expect(currentState).toEqual<BasketStoreState>({
            items: [{ itemId: '1', quantity: 3 }]
        });

        currentState = addItemReducer(currentState, [
            { itemId: '1', quantity: 2 },
            { itemId: '1', quantity: 3 }
        ]);
        expect(currentState).toEqual<BasketStoreState>({
            items: [{ itemId: '1', quantity: 8 }]
        });

        currentState = addItemReducer(currentState, [
            { itemId: '1', quantity: 2 },
            '2',
            '1',
            { itemId: '2', quantity: 5 }
        ]);

        expect(currentState).toEqual<BasketStoreState>({
            items: [
                { itemId: '1', quantity: 11 },
                { itemId: '2', quantity: 6 }
            ]
        });
    });
});
