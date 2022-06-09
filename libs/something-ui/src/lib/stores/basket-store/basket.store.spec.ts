import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { Item } from '../models/item.model';
import { UtilsasketStore } from './basket.store';

const testScheduler = new TestScheduler((actual, expected) =>
    expect(actual).toEqual(expected)
);

describe('UtilsasketStoreService', () => {
    let basketStore: UtilsasketStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UtilsasketStore]
        });
        basketStore = TestBed.inject(UtilsasketStore);
    });

    it('should return the given item with the given id', () => {
        testScheduler.run(({ expectObservable }) => {
            basketStore.patchState({
                items: [
                    { quantity: 1, itemId: '1' },
                    { quantity: 1, itemId: '1' }
                ]
            });

            expectObservable(basketStore.items$).toBe('a', {
                a: [
                    { quantity: 1, itemId: '1' },
                    { quantity: 1, itemId: '2' }
                ]
            });
        });
    });
});
