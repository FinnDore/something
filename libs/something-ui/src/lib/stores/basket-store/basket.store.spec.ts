import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { ShopStore } from '../shop-store/shop.store';
import { BasketStore } from './basket.store';

const testScheduler = new TestScheduler((actual, expected) =>
    expect(actual).toEqual(expected)
);

describe('BasketStore', () => {
    let basketStore: BasketStore;
    let shopStore: ShopStore;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ShopStore, BasketStore]
        });
        basketStore = TestBed.inject(BasketStore);
        shopStore = TestBed.inject(ShopStore);
    });

    it('should return the given item with the given id', () => {
        testScheduler.run(({ expectObservable }) => {
            const items = [
                { quantity: 1000, itemId: '1' },
                { quantity: 20020, itemId: '3' }
            ];
            shopStore.patchState({
                items: [
                    {
                        itemId: '3'
                    },
                    { itemId: '1' }
                ]
            });
            basketStore.addItem(items);

            expectObservable(basketStore.items$, '-!').toBe('a', { a: items });
        });
    });
});
