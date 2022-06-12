import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { ShopStore } from '../shop-store/shop.store';
import { BasketStore } from './basket.store';

const testScheduler = new TestScheduler((actual, expected) =>
    expect(actual).toEqual(expected)
);

describe('BasketStore', () => {
    let basketStore: BasketStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ShopStore, BasketStore]
        });
        basketStore = TestBed.inject(BasketStore);
    });

    it('should return the complete list of items in the basket', () => {
        testScheduler.run(({ expectObservable }) => {
            const items = [
                { quantity: 1000, itemId: '1' },
                { quantity: 20020, itemId: '3' }
            ];

            basketStore.addItem(items);

            expectObservable(basketStore.items$, '-!').toBe('a', { a: items });
        });
    });

    it('should return empty array if there are no items in the basket', () => {
        testScheduler.run(({ expectObservable }) => {
            basketStore.patchState({ items: [] });
            expectObservable(basketStore.items$, '-!').toBe('-a', {
                a: []
            });
        });
    });
});
