import { TestBed } from '@angular/core/testing';
import { tap } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { Item } from '../../models/item.model';
import { ShopStore } from '../shop-store/shop.store';
import { ItemStore } from './item.store';

const testScheduler = new TestScheduler((actual, expected) =>
    expect(actual).toEqual(expected)
);

describe('ItemStore', () => {
    let shopStore: ShopStore;
    let itemStore: ItemStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ShopStore, ItemStore]
        });
        shopStore = TestBed.inject(ShopStore);
        itemStore = TestBed.inject(ItemStore);
    });

    it('should return the current item', () => {
        testScheduler.run(({ expectObservable }) => {
            const item: Item = {
                itemId: '1'
            };
            shopStore.patchState({
                items: [item]
            });
            itemStore.patchState({ selectedItemId: '1' });

            expectObservable(itemStore.item$, '-!').toBe('a', { a: item });
        });
    });

    it('should return the current item when it changes', () => {
        testScheduler.run(({ expectObservable, cold }) => {
            const items = ['1', '2', '3'].map(itemId => ({
                itemId
            }));
            shopStore.patchState({
                items: items
            });

            const inputStream$ = cold('abc', {
                a: items[0],
                b: items[1],
                c: items[2]
            });

            inputStream$.pipe(
                tap(({ itemId: selectedItemId }) =>
                    itemStore.patchState({ selectedItemId })
                )
            );

            expectObservable(inputStream$, '---!').toBe('-abc', {
                a: items[0],
                b: items[1],
                c: items[2]
            });
        });
    });
});
