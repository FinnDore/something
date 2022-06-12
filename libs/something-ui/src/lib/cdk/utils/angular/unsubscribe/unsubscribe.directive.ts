import { Directive, NgModule, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[NO-SELECTOR]'
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class Unsubscribe implements OnDestroy {
    public readonly destroy$ = new Subject<void>();
    /**
     *
     */
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [Unsubscribe],
    exports: [Unsubscribe]
})
export class UnsubscribeModule {}
