import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BasketStore } from '../../stores/basket-store/basket.store';
import { ItemStore } from '../../stores/item-store/item.store';
import { ShopStore } from '../../stores/shop-store/shop.store';
import { AddToBasketDirective } from './primitives';

@Component({
    selector: 's-test-component',
    template: '<button s-add-to-basket></button>'
})
class TestComponent {}

describe('AddToBasketDirective', () => {
    let shopStore: ShopStore;
    let basketStoreSpy: jest.SpyInstance;
    let fixture: ComponentFixture<TestComponent>;
    let itemStore: ItemStore;
    let button: HTMLButtonElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestComponent, AddToBasketDirective],
            providers: [ShopStore, BasketStore, ItemStore]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        shopStore = TestBed.inject(ShopStore);
        itemStore = TestBed.inject(ItemStore);

        const basketStore = TestBed.inject(BasketStore);
        basketStoreSpy = jest.spyOn(basketStore, 'addItem');

        button = fixture.debugElement.query(By.css('button')).nativeElement;

        shopStore.patchState({
            items: [
                {
                    itemId: '1'
                },
                {
                    itemId: '2'
                }
            ]
        });
    });

    it('should add the current item to the basket', () => {
        itemStore.patchState({
            selectedItemId: '1'
        });

        button.click();

        expect(basketStoreSpy).toHaveBeenCalledTimes(1);
        expect(basketStoreSpy).toBeCalledWith('1');
    });

    it('should add the current item to the basket after it has changed', () => {
        itemStore.patchState({
            selectedItemId: '1'
        });
        button.click();

        expect(basketStoreSpy).toHaveBeenCalledTimes(1);
        expect(basketStoreSpy).toBeCalledWith('1');

        itemStore.patchState({
            selectedItemId: '2'
        });
        button.click();

        expect(basketStoreSpy).toHaveBeenCalledTimes(2);
        expect(basketStoreSpy).toBeCalledWith('2');
    });

    it('should not add and item if the item is null', () => {
        itemStore.patchState({
            selectedItemId: null as unknown as string
        });
        button.click();
        expect(basketStoreSpy).not.toHaveBeenCalled();
    });
});
