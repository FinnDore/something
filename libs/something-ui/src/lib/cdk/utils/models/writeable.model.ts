/**
 * Makes all keys in the item writeable
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
