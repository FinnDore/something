import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule
} from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { loadStripe } from '@stripe/stripe-js';

@Component({
    selector: 's-item',
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
export class ItemComponentModule {
    /**
     *
     */
    async setUp(): Promise<void> {
        const stripe = await loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
    }
}
