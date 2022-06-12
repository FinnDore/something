import { BasketStoreState } from '../basket.store';
import { removeItemReducer } from './remove-item.reducer';

describe('removeItemReducer', () => {
    it('should remove the given item from the basket with the given id or adjust its quantity', () => {
        let currentState: BasketStoreState = {
            items: [{ itemId: '1', quantity: 1 }]
        };
        currentState = removeItemReducer(currentState, '1');
        expect(currentState).toEqual<BasketStoreState>({
            items: []
        });
        currentState = {
            items: [{ itemId: '1', quantity: 3 }]
        };
        currentState = removeItemReducer(currentState, '1');
        expect(currentState).toEqual<BasketStoreState>({
            items: [{ itemId: '1', quantity: 2 }]
        });
        currentState = {
            items: [{ itemId: '1', quantity: 4 }]
        };
        currentState = removeItemReducer(currentState, ['1', '1']);
        expect(currentState).toEqual<BasketStoreState>({
            items: [{ itemId: '1', quantity: 2 }]
        });
        currentState = {
            items: [
                { itemId: '1', quantity: 6 },
                { itemId: '2', quantity: 2 }
            ]
        };
        currentState = removeItemReducer(currentState, ['1', '2', '1', '2']);
        expect(currentState).toEqual<BasketStoreState>({
            items: [{ itemId: '1', quantity: 4 }]
        });
    });

    it('should remove the given item from the basket or adjust its quantity with the given id and quantity or just and id', () => {
        let currentState: BasketStoreState = {
            items: [
                {
                    itemId: '1',
                    quantity: 1
                }
            ]
        };
        currentState = removeItemReducer(currentState, {
            itemId: '1',
            quantity: 1
        });
        expect(currentState).toEqual<BasketStoreState>({
            items: []
        });

        currentState = {
            items: [
                {
                    itemId: '1',
                    quantity: 5
                }
            ]
        };
        currentState = removeItemReducer(currentState, {
            itemId: '1',
            quantity: 2
        });
        expect(currentState).toEqual<BasketStoreState>({
            items: [{ itemId: '1', quantity: 3 }]
        });

        currentState = {
            items: [{ itemId: '1', quantity: 6 }]
        };
        currentState = removeItemReducer(currentState, [
            { itemId: '1', quantity: 2 },
            { itemId: '1', quantity: 3 }
        ]);
        expect(currentState).toEqual<BasketStoreState>({
            items: [{ itemId: '1', quantity: 1 }]
        });

        currentState = {
            items: [
                { itemId: '1', quantity: 4 },
                { itemId: '2', quantity: 12 }
            ]
        };
        currentState = removeItemReducer(currentState, [
            { itemId: '1', quantity: 2 },
            '2',
            '1',
            { itemId: '2', quantity: 5 }
        ]);
        expect(currentState).toEqual<BasketStoreState>({
            items: [
                { itemId: '1', quantity: 1 },
                { itemId: '2', quantity: 6 }
            ]
        });
    });

    it('should ignore any quantity values and just remove each item from the basket', () => {
        let currentState: BasketStoreState = {
            items: [
                {
                    itemId: '1',
                    quantity: 10
                }
            ]
        };
        currentState = removeItemReducer(currentState, {
            itemId: {
                itemId: '1',
                quantity: 5
            },
            ignoreQuantity: true
        });
        expect(currentState).toEqual<BasketStoreState>({
            items: []
        });

        currentState = {
            items: [
                {
                    itemId: '1',
                    quantity: 10
                },
                {
                    itemId: '2',
                    quantity: 11
                }
            ]
        };
        currentState = removeItemReducer(currentState, {
            itemId: [
                {
                    itemId: '1',
                    quantity: 5
                },
                '2'
            ],
            ignoreQuantity: true
        });
        expect(currentState).toEqual<BasketStoreState>({
            items: []
        });
    });

    it('should not throw an error when removing an item that does not exist any quantity values and just remove each item from the basket', () => {
        let currentState: BasketStoreState = {
            items: []
        };
        currentState = removeItemReducer(currentState, {
            itemId: '1',
            quantity: 5
        });
        expect(currentState).toEqual<BasketStoreState>({
            items: []
        });

        currentState = {
            items: []
        };
        currentState = removeItemReducer(currentState, '2');
        expect(currentState).toEqual<BasketStoreState>({
            items: []
        });

        currentState = {
            items: []
        };
        currentState = removeItemReducer(currentState, ['2', '3', '4']);
        expect(currentState).toEqual<BasketStoreState>({
            items: []
        });

        currentState = {
            items: []
        };
        currentState = removeItemReducer(currentState, {
            itemId: [
                {
                    itemId: '1',
                    quantity: 5
                },
                '2',
                {
                    itemId: '1',
                    quantity: 1
                }
            ],
            ignoreQuantity: true
        });
        expect(currentState).toEqual<BasketStoreState>({
            items: []
        });
    });
});
