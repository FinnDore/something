import { Item } from './item.model';

/**
 * A generic interface that describes options used when checking out
 */
export interface CheckoutWithNoOptions {
    items: Item[];
}

/**
 * A generic interface that describes options used when checking out with extra options. Commonly used when defining your own checkout provider.
 */
export interface CheckoutWithOptions<T> extends CheckoutWithNoOptions {
    options?: T;
}

/**
 * The options to checkout with
 */
export type CheckoutOptions<T = void> = T extends Record<
    string | number,
    unknown
>
    ? CheckoutWithOptions<T>
    : CheckoutWithNoOptions;
