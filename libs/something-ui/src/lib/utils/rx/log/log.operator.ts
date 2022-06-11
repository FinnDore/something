import { MonoTypeOperatorFunction, pipe, tap } from 'rxjs';

/**
 * Logs passing values in the observable pre appended with the given values to log
 * @param valueToAlsoLog values to also log
 * @returns an operator that logs passing values
 */
export function log<T>(
    valueToAlsoLog?: object | number | string | boolean
): MonoTypeOperatorFunction<T> {
    // eslint-disable-next-line no-console
    return pipe(tap(val => console.log(valueToAlsoLog, val)));
}
