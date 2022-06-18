import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RedirectToCheckoutClientOptions, Stripe } from '@stripe/stripe-js';
import { Observable, Subject, switchMap, tap } from 'rxjs';
import { RunHelpers, TestScheduler } from 'rxjs/testing';
import { CheckoutOptions, CheckoutWithoutOptions } from '../../../models';
import { StripeCheckoutStore } from './stripe-checkout.store';

const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
});

describe('StripeCheckoutStore', () => {
    let stripeCheckoutStore: StripeCheckoutStore;
    let redirectToCheckout: typeof jest.fn;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [StripeCheckoutStore]
        }).compileComponents();
        stripeCheckoutStore = TestBed.inject(StripeCheckoutStore);

        redirectToCheckout = jest.fn();
        const fakeStripe = {
            redirectToCheckout: redirectToCheckout
        } as unknown as Stripe;

        stripeCheckoutStore.patchState({
            stripe: fakeStripe
        });
    });

    it('should checkout with he correct settings', () => {
        stripeCheckoutStore.checkout({ items: [{ itemId: '1', quantity: 1 }] });

        expect(redirectToCheckout).toBeCalledTimes(1);
        expect(redirectToCheckout).toBeCalledWith({
            lineItems: [
                {
                    price: '1',
                    quantity: 1
                }
            ],
            mode: 'payment',
            successUrl: window.location.origin,
            cancelUrl: window.location.origin
        });
    });

    it('should not checkout when stripe is null', () => {
        stripeCheckoutStore.patchState({ stripe: null });
        (stripeCheckoutStore as unknown as { stripe$: unknown }).stripe$ =
            stripeCheckoutStore.getStripe();
        stripeCheckoutStore.checkout({ items: [{ itemId: '1', quantity: 1 }] });

        expect(redirectToCheckout).toBeCalledTimes(0);
    });

    it('should not checkout when no options items are passed is null', () => {
        stripeCheckoutStore.checkout({
            options: {}
        } as unknown as CheckoutWithoutOptions);
        expect(redirectToCheckout).toBeCalledTimes(0);
    });

    describe('getStripeForCheckout', () => {
        type options = CheckoutOptions<RedirectToCheckoutClientOptions>;
        let stripeCheckoutStoreWithGetStripe: {
            getStripeForCheckout: (
                opts: options
            ) => Observable<[options, Stripe] | null>;
            flushStripe$: Subject<void>;
        };

        let getStripe: (
            options: options
        ) => Observable<[options, Stripe] | null>;

        const fakeStripe = { s: 'this IS stripe' } as unknown as Stripe;
        const items = [
            { quantity: 1000, itemId: '1' },
            { quantity: 20020, itemId: '3' }
        ];
        let flushStripe: () => void;

        let getSource: (
            marbles: string,
            cold: RunHelpers['cold']
        ) => Observable<unknown>;

        beforeEach(() => {
            stripeCheckoutStoreWithGetStripe =
                stripeCheckoutStore as unknown as {
                    getStripeForCheckout: (
                        opts: options
                    ) => Observable<[options, Stripe] | null>;
                    flushStripe$: Subject<void>;
                };

            getStripe = (options: options) =>
                stripeCheckoutStoreWithGetStripe.getStripeForCheckout(options);

            flushStripe = (): void =>
                stripeCheckoutStoreWithGetStripe.flushStripe$.next();

            getSource = (
                marbles: string,
                cold: RunHelpers['cold']
            ): Observable<unknown> =>
                cold<Stripe | null>(marbles, {
                    a: fakeStripe,
                    b: null
                }).pipe(
                    tap(stripe =>
                        stripeCheckoutStore.patchState({
                            stripe: stripe as unknown as Stripe | null
                        })
                    )
                );
            stripeCheckoutStore.patchState({ stripe: null });
        });

        it('should not emit a value until it has a stripe object', () => {
            testScheduler.run(({ expectObservable, cold }) => {
                getSource('bb-a', cold).subscribe();

                const source$ = cold('a', { a: null }).pipe(
                    switchMap(() => getStripe({ items }))
                );

                expectObservable(source$, '---- !').toBe('---a', {
                    a: [{ items }, fakeStripe]
                });
            });
        });

        it('should complete will null if it never receives a stripe and flushStripe emits', () => {
            testScheduler.run(({ expectObservable, cold }) => {
                getSource('bbbb|', cold).subscribe({ complete: flushStripe });
                const source$ = cold('a', { a: null }).pipe(
                    switchMap(() => getStripe({ items }))
                );

                expectObservable(source$).toBe('--------a', {
                    a: null
                });
            });
        });
    });

    it('should only call checkout once if multiple checkouts are made while one is in progress', fakeAsync(() => {
        const longWaitingCheckoutFn = jest.fn(
            async () => new Promise(res => setTimeout(res, 10))
        );

        stripeCheckoutStore.patchState({
            stripe: {
                redirectToCheckout: longWaitingCheckoutFn
            } as unknown as Stripe
        });

        stripeCheckoutStore.checkout({ items: [{ itemId: '3', quantity: 3 }] });
        stripeCheckoutStore.checkout({ items: [{ itemId: '2', quantity: 1 }] });
        stripeCheckoutStore.checkout({ items: [{ itemId: '2', quantity: 1 }] });
        stripeCheckoutStore.checkout({ items: [{ itemId: '2', quantity: 1 }] });
        stripeCheckoutStore.checkout({ items: [{ itemId: '2', quantity: 1 }] });

        tick(11);

        expect(longWaitingCheckoutFn).toBeCalledTimes(1);
        expect(longWaitingCheckoutFn).toBeCalledWith({
            lineItems: [
                {
                    price: '3',
                    quantity: 3
                }
            ],
            mode: 'payment',
            successUrl: `${window.location.origin}`,
            cancelUrl: `${window.location.origin}`
        });

        tick(4);

        stripeCheckoutStore.checkout({ items: [{ itemId: '5', quantity: 5 }] });

        tick(1);

        stripeCheckoutStore.checkout({ items: [{ itemId: '4', quantity: 3 }] });
        stripeCheckoutStore.checkout({ items: [{ itemId: '4', quantity: 3 }] });

        tick(8);

        expect(longWaitingCheckoutFn).toBeCalledTimes(2);
        expect(longWaitingCheckoutFn).toHaveBeenLastCalledWith({
            lineItems: [
                {
                    price: '5',
                    quantity: 5
                }
            ],
            mode: 'payment',
            successUrl: window.location.origin,
            cancelUrl: window.location.origin
        });

        tick(20);
    }));
});
