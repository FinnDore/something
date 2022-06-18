import {
    CheckoutWithOptions,
    CheckoutWithoutOptions
} from './checkout-options.model';

export interface CheckoutProvider<T = void> extends Object {
    checkout: (
        checkoutOpts: CheckoutWithoutOptions | CheckoutWithOptions<T>
    ) => unknown;
}
