import {
    ChangeDetectionStrategy,
    Component,
    DebugElement,
    Input
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemStore } from '../../stores/item-store/item.store';
import { ShopStore } from '../../stores/shop-store/shop.store';
import { ItemDirective } from './item.directive';

@Component({
    selector: 's-test-component',
    template: '<button [s-item]="itemId"></button>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
class TestComponent {
    @Input() itemId: string | null = null;
}

describe('ItemDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: DebugElement;
    let itemStoreSpy: jest.SpyInstance;

    beforeEach(async () => {
        const a = {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            patchState(): void {}
        };
        itemStoreSpy = jest.spyOn(a, 'patchState');
        await TestBed.configureTestingModule({
            declarations: [TestComponent, ItemDirective],
            providers: [ShopStore]
        })
            .overrideProvider(ItemStore, { useValue: a })
            .compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.debugElement;
    });

    it(`should set the current itemId to match the directive's input `, () => {
        component.componentInstance.itemId = '1';
        fixture.changeDetectorRef.detectChanges();

        expect(itemStoreSpy).toBeCalledTimes(1);
        expect(itemStoreSpy).toHaveBeenCalledWith({ selectedItemId: '1' });
    });

    it(`should not set the current itemId to match the directive's input when the input is null `, () => {
        component.componentInstance.itemId = null;
        fixture.changeDetectorRef.detectChanges();

        expect(itemStoreSpy).not.toHaveBeenCalled();
    });
});
