import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BasketStore } from '../../stores/basket-store/basket.store';
import { ItemStore } from '../../stores/item-store/item.store';
import { ShopStore } from '../../stores/shop-store/shop.store';
import {
    RemoveFromBasketDirective,
    RemoveFromBasketModule
} from './remove-from-basket.directive';

@Component({
    selector: 's-test-component',
    template: `<button s-remove-from-basket></button>`,
    standalone: true,
    imports: [RemoveFromBasketModule]
})
class TestComponent {
    @ViewChild(RemoveFromBasketDirective)
    public removeFromBasketDirective: RemoveFromBasketDirective | null = null;
}

describe('RemoveFromBasketDirective', () => {
    let basketStoreSpy: jest.SpyInstance;
    let fixture: ComponentFixture<TestComponent>;
    let itemStore: ItemStore;
    let button: HTMLButtonElement;
    let component: TestComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent],
            providers: [ShopStore, BasketStore, ItemStore]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        itemStore = TestBed.inject(ItemStore);

        const basketStore = TestBed.inject(BasketStore);
        basketStoreSpy = jest.spyOn(basketStore, 'removeItem');

        button = fixture.debugElement.query(By.css('button')).nativeElement;
        component = fixture.componentInstance;
    });

    it('should remove the current item from the basket', () => {
        itemStore.patchState({
            selectedItemId: '1'
        });

        button.click();

        expect(basketStoreSpy).toHaveBeenCalledTimes(1);
        expect(basketStoreSpy).toBeCalledWith({
            itemId: '1',
            ignoreQuantity: false
        });
    });

    it('should remove the current item from the basket after it has changed', () => {
        itemStore.patchState({
            selectedItemId: '1'
        });
        button.click();

        expect(basketStoreSpy).toHaveBeenCalledTimes(1);
        expect(basketStoreSpy).toBeCalledWith({
            itemId: '1',
            ignoreQuantity: false
        });

        itemStore.patchState({
            selectedItemId: '2'
        });
        button.click();

        expect(basketStoreSpy).toHaveBeenCalledTimes(2);
        expect(basketStoreSpy).toBeCalledWith({
            itemId: '2',
            ignoreQuantity: false
        });
    });

    it('should call remove item with the ignore quantity value set to true', () => {
        itemStore.patchState({
            selectedItemId: '1'
        });
        fixture.debugElement.injector.get(ChangeDetectorRef).detectChanges();

        if (component.removeFromBasketDirective) {
            component.removeFromBasketDirective.sIgnoreQuantity = true;
        }

        button.click();

        expect(basketStoreSpy).toHaveBeenCalledTimes(1);
        expect(basketStoreSpy).toBeCalledWith({
            itemId: '1',
            ignoreQuantity: true
        });
    });

    it('should not add and item if the item is null', () => {
        itemStore.patchState({
            selectedItemId: null as unknown as string
        });
        button.click();
        expect(basketStoreSpy).not.toHaveBeenCalled();
    });
});
