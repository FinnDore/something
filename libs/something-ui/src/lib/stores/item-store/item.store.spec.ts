import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { Item } from '../../models/item.model';
import { ShopStore } from '../shop-store/shop.store';
import { ItemStore } from './item.store';

const testScheduler = new TestScheduler((actual, expected) =>
    expect(actual).toEqual(expected)
);

describe('BasketStoreService', () => {
    let shopStore: ShopStore;
    let itemStore: ItemStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ItemStore]
        });
        shopStore = TestBed.inject(ShopStore);
        itemStore = TestBed.inject(ItemStore);
    });

    it('should return the current item', () => {
        testScheduler.run(({ expectObservable }) => {
            const item: Item = {
                id: '1'
            };
            shopStore.patchState({
                items: [item]
            });
            itemStore.patchState({ selectedItemId: '1' });

            expectObservable(itemStore.item$).toBe('a', { a: item });
        });
    });
});
