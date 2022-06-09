import { ChangeDetectorRef, inject, ViewRef } from '@angular/core';
import { MonoTypeOperatorFunction, pipe, Subject, takeUntil } from 'rxjs';

/**
 *
 * @returns an operator that
 */
export function takeUntilDestroy<T>(): MonoTypeOperatorFunction<T> {
    const destroy$ = new Subject<void>();

    const viewRef = inject(ChangeDetectorRef) as ViewRef;
    console.log(viewRef);
    viewRef.onDestroy(() => {
        destroy$.next();
        destroy$.complete();
    });
    return pipe(takeUntil(destroy$));
}
