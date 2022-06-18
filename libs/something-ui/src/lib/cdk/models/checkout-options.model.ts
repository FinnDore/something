import { BasketItem } from './basket-item.model';

/**
 * A generic interface that describes options used when checking out
 */
export interface CheckoutWithoutOptions {
    items: BasketItem[];
}

/**
 * A generic interface that describes options used when checking out with extra options. Commonly used when defining your own checkout provider.
 */
export interface CheckoutWithOptions<T> extends CheckoutWithoutOptions {
    options?: T;
}

/**
 * The options to checkout with
 */
export type CheckoutOptions<T = void> = T extends Record<string, unknown>
    ? CheckoutWithOptions<T>
    : CheckoutWithoutOptions;
