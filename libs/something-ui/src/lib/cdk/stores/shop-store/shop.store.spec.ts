import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { Item } from '../../models/item.model';
import { ShopStore } from './shop.store';

const testScheduler = new TestScheduler((actual, expected) =>
    expect(actual).toEqual(expected)
);

describe('ShopStore', () => {
    let shopStore: ShopStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ShopStore]
        });
        shopStore = TestBed.inject(ShopStore);
    });

    it('should return the given item with the given id', () => {
        testScheduler.run(({ expectObservable }) => {
            const item: Item = {
                itemId: '1'
            };
            shopStore.patchState({
                items: [item]
            });

            expectObservable(shopStore.getItem('1'), '-!').toBe('a', {
                a: item
            });
        });
    });
});
