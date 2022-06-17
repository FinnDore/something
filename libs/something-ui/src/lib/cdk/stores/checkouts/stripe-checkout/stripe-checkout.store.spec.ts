import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Stripe } from '@stripe/stripe-js';
import { StripeCheckoutStore } from './stripe-checkout.store';

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
