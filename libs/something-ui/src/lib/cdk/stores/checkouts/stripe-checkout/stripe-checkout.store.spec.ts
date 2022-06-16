import { TestBed } from '@angular/core/testing';
import { StripeCheckoutStore } from './stripe-checkout.store';

// const testScheduler = new TestScheduler((actual, expected) =>
//     expect(actual).toEqual(expected)
// );

describe('ItemStore', () => {
    // let shopStore: ShopStore;
    // let stripeCheckoutStore: StripeCheckoutStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StripeCheckoutStore]
        });
        // stripeCheckoutStore = TestBed.inject(StripeCheckoutStore);
    });

    it('-', () => {
        expect(true).toBe(true);
    });

    // it('should return the current item when it changes', () => {
    //     testScheduler.run(({ expectObservable, cold }) => {
    //         const items = ['1', '2', '3'].map(itemId => ({
    //             itemId
    //         }));
    //         shopStore.patchState({
    //             items: items
    //         });

    //         const inputStream$ = cold('abc', {
    //             a: items[0],
    //             b: items[1],
    //             c: items[2]
    //         });

    //         inputStream$.pipe(
    //             tap(({ itemId: selectedItemId }) =>
    //                 itemStore.patchState({ selectedItemId })
    //             )
    //         );

    //         expectObservable(inputStream$, '---!').toBe('-abc', {
    //             a: items[0],
    //             b: items[1],
    //             c: items[2]
    //         });
    //     });
    // });
});
