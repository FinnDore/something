import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule
} from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
    selector: 's-ui-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent {
    @Input() price = 0;
}

@NgModule({
    imports: [CommonModule, TuiButtonModule],
    declarations: [ItemComponent],
    exports: [ItemComponent]
})
export class ItemComponentModule {}
