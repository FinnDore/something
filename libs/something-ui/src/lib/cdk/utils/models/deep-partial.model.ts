/**
 * Makes all property's optional recursively
 */
export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };
