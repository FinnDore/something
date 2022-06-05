import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
    selector: 's-ui-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent {}

@NgModule({
    imports: [CommonModule],
    declarations: [ItemComponent],
    exports: [ItemComponent]
})
export class ItemComponentModule {}
