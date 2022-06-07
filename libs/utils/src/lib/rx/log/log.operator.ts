import { MonoTypeOperatorFunction, pipe, tap } from 'rxjs';

/**
 *
 * @returns an operator that
 */
export function log<T>(
    valueToAlsoLog?: object | number | string | boolean
): MonoTypeOperatorFunction<T> {
    return pipe(tap((val) => console.log(valueToAlsoLog, val)));
}
