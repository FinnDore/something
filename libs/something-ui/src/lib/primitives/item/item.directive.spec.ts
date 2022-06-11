import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DebugElement,
    Input
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ItemStore } from '../../stores/item-store/item.store';
import { ShopStore } from '../../stores/shop-store/shop.store';
import { ItemDirective } from './item.directive';

@Component({
    selector: 's-test-sub-component',
    template: `{{ itemStore.itemId$ | async }}`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule]
})
export class TestSubComponent {
    /**
     * Constructor for TestSubComponent
     * @param itemStore the itemStore
     */
    constructor(public itemStore: ItemStore) {}
}

@Component({
    selector: 's-test-component',
    template: `<button [s-item]="itemId">
        <s-test-sub-component></s-test-sub-component>
    </button>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: []
})
class TestComponent {
    @Input() itemId: string | null = null;
}

describe('ItemDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: DebugElement;
    let testSubComponent: DebugElement;
    let itemStoreSpy: jest.SpyInstance;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestSubComponent],
            declarations: [ItemDirective, TestComponent],
            providers: [ShopStore, ItemStore]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.debugElement;
        const itemDirective = component.query(By.directive(ItemDirective));
        itemStoreSpy = jest.spyOn(
            itemDirective.injector.get(ItemStore),
            'patchState'
        );
        testSubComponent = component.query(By.directive(TestSubComponent));
    });

    it(`should set the current itemId to match the directive's input `, () => {
        component.componentInstance.itemId = '1';
        fixture.changeDetectorRef.detectChanges();

        expect(itemStoreSpy).toBeCalledTimes(1);
        expect(itemStoreSpy).toHaveBeenCalledWith({ selectedItemId: '1' });
        expect(testSubComponent.nativeElement.innerHTML).toEqual('1');
    });

    it(`should not set the current itemId to match the directive's input when the input is null `, () => {
        component.componentInstance.itemId = null;
        fixture.changeDetectorRef.detectChanges();

        expect(itemStoreSpy).not.toHaveBeenCalled();
        expect(testSubComponent.nativeElement.innerHTML).toEqual('');
    });
});
