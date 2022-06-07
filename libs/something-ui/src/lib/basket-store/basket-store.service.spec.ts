import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { Item } from '../models/item.model';
import { BasketStore } from './basket-store.service';

const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
});

describe('BasketStoreService', () => {
    let basketStore: BasketStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BasketStore]
        });
        basketStore = TestBed.inject(BasketStore);
    });

    it('should return the given item with the given id', () => {
        testScheduler.run(({ expectObservable }) => {
            const item: Item = {
                id: '1'
            };
            basketStore.patchState({
                items: [item]
            });

            expectObservable(basketStore.getItem('1')).toBe('a', { a: item });
        });
    });
});
