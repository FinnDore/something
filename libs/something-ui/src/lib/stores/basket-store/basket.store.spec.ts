// import { TestBed } from '@angular/core/testing';
// import { tap } from 'rxjs';
// import { TestScheduler } from 'rxjs/testing';
// import { log } from '../../utils/rx/log';
// import { ShopStore } from '../shop-store/shop.store';
// import { BasketStore } from './basket.store';

// const testScheduler = new TestScheduler((actual, expected) =>
//     expect(actual).toEqual(expected)
// );

// describe('BasketStoreService', () => {
//     let basketStore: BasketStore;
//     let shopStore: ShopStore;
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [ShopStore, BasketStore]
//         });
//         basketStore = TestBed.inject(BasketStore);
//         shopStore = TestBed.inject(ShopStore);
//     });

//     it('should return the given item with the given id', () => {
//         testScheduler.run(({ expectObservable, cold }) => {
//             shopStore.patchState({
//                 items: ['1', '3', '4', '5'].map((id) => ({ id }))
//             });
//             const items = {
//                 a: {
//                     items: [{ quantity: 1, itemId: '1' }]
//                 },
//                 b: {
//                     items: [
//                         { quantity: 2, itemId: '4' },
//                         { quantity: 5, itemId: '1' }
//                     ]
//                 },
//                 c: {
//                     items: [
//                         { quantity: 1000, itemId: '1' },
//                         { quantity: 20020, itemId: '3' }
//                     ]
//                 }
//             };

//             const inputStream = 'abc';
//             const testData$ = cold(inputStream, items);

//             const outputItems: Record<
//                 string,
//                 { itemId: string; quantity: number }[]
//             > = {
//                 a: [
//                     {
//                         itemId: '1',
//                         quantity: 1
//                     }
//                 ],
//                 b: [
//                     {
//                         itemId: '1',
//                         quantity: 6
//                     },
//                     { quantity: 2, itemId: '4' }
//                 ],
//                 c: [
//                     {
//                         quantity: 1,
//                         itemId: '1006'
//                     },
//                     { quantity: 20020, itemId: '3' }
//                 ]
//                 // d: [],
//                 // e: [],

//                 // f: []
//             };

//             testData$
//                 .pipe(tap((val) => basketStore.patchState(val)))
//                 .subscribe();

//             expectObservable(basketStore.items$.pipe(log())).toBe(
//                 'abcdef',
//                 outputItems
//             );
//         });
//     });
// });
