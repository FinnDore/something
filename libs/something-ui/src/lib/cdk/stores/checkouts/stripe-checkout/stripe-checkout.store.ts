import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { pipe, tap } from 'rxjs';
import { EventState } from '../../../enums';
import { CheckoutOptions } from '../../../models';
import { BasketStore } from '../../basket-store';

export interface StripeCheckoutStoreState {
    stripe: Stripe | null;
    stripeState: EventState;
}

const DEFAULT_STATE: StripeCheckoutStoreState = {
    stripe: null,
    stripeState: EventState.INIT
};

// TODO provide a way of injecting this at runtime
const DEV_STRIPE_KEY =
    'pk_test_51L6xQsKBi9YpHhPG8Txhae1QMc9W2OKk8NoYXcGbyEV1KV1HdggRkuy1mOueulSFhHSmHb8nxhLQtLC4MNtl0u8m00EIcSMkgL';

@Injectable()
export class StripeCheckoutStore extends ComponentStore<StripeCheckoutStoreState> {
    public readonly checkout = this.effect<CheckoutOptions>(
        pipe(tap(val => val))
    );

    /**
     * Sets up stripe with the given stipe key
     * @param stripeKey the stripe key to use
     * @returns a boolean indicating if stripe wa setup correctly
     */
    async setupStripe(stripeKey: string): Promise<boolean> {
        const stripe = await loadStripe(stripeKey);

        if (stripe) {
            return false;
        }

        this.patchState({ stripe });
        return true;
    }

    /**
     * Constructor for StripeCheckoutStore
     */
    constructor(private basketStore: BasketStore) {
        super(DEFAULT_STATE);
    }
}

// return await stripe.redirectToCheckout({
//     lineItems: items.map(({ itemId, quantity }) => ({
//         price: itemId,
//         quantity
//     })),
//     mode: 'payment',
//     successUrl: `${window.location.origin}`,
//     cancelUrl: `${window.location.origin}`
// });
