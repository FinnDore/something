// import { TestBed } from '@angular/core/testing';
// import { TestScheduler } from 'rxjs/testing';
// import { Item } from '../models/item.model';
// import { UtilsasketStore } from './shop.store';

// const testScheduler = new TestScheduler((actual, expected) =>
//     expect(actual).toEqual(expected)
// );

// describe('UtilsasketStoreService', () => {
//     let basketStore: UtilsasketStore;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [UtilsasketStore]
//         });
//         basketStore = TestBed.inject(UtilsasketStore);
//     });

//     it('should return the given item with the given id', () => {
//         testScheduler.run(({ expectObservable }) => {
//             const item: Item = {
//                 id: '1'
//             };
//             basketStore.patchState({
//                 items: [item]
//             });

//             expectObservable(basketStore.getItem('1')).toBe('a', { a: item });
//         });
//     });
// });
