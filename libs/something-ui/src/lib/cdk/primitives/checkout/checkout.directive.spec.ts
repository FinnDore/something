import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BasketStore } from '../../stores/basket-store/basket.store';
import { ItemStore } from '../../stores/item-store/item.store';
import { ShopStore } from '../../stores/shop-store/shop.store';
import { ItemDirectiveModule } from '../item/item.directive';
import { RemoveFromBasketDirective } from '../remove-from-basket';
import {
    CheckoutDirective,
    CheckoutDirectiveModule
} from './checkout.directive';

@Component({
    selector: 's-test-component',
    template: `<button s-checkout></button>`,
    standalone: true,
    imports: [CheckoutDirectiveModule]
})
class TestComponent {
    @ViewChild(CheckoutDirective)
    public checkoutDirective: CheckoutDirective | null = null;
}

describe('CheckoutDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let basketStore: BasketStore;
    let button: HTMLButtonElement;
    let component: TestComponent;
    let checkoutFn: jest.Mock<unknown, unknown[]>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent],
            providers: [ShopStore, BasketStore]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        basketStore = TestBed.inject(BasketStore);
        button = fixture.debugElement.query(By.css('button')).nativeElement;
        component = fixture.componentInstance;

        fixture.changeDetectorRef.detectChanges();
        if (component.checkoutDirective) {
            component.checkoutDirective.redirectToCheckout = jest.fn();
            checkoutFn = component.checkoutDirective
                .redirectToCheckout as jest.Mock<unknown, unknown[]>;
        }
    });

    it('should checkout the the current items in the basket', () => {
        basketStore.patchState({
            items: [
                {
                    itemId: '1',
                    quantity: 1
                }
            ]
        });

        button.click();

        expect(checkoutFn).toHaveBeenCalledTimes(1);
        expect(checkoutFn).toBeCalledWith([
            {
                itemId: '1',
                quantity: 1
            }
        ]);
    });

    it('should be able to handle multiple items in the basket', () => {
        basketStore.patchState({
            items: [
                {
                    itemId: '1',
                    quantity: 1
                },
                {
                    itemId: '3',
                    quantity: 111
                }
            ]
        });

        button.click();

        expect(checkoutFn).toHaveBeenCalledTimes(1);
        expect(checkoutFn).toBeCalledWith([
            {
                itemId: '1',
                quantity: 1
            },
            {
                itemId: '3',
                quantity: 111
            }
        ]);
    });

    it('should call only checkout once when the checkout button is spammed ', () => {
        jest.useFakeTimers();
        expect(component).toBeTruthy();

        if (!component.checkoutDirective) {
            return;
        }

        component.checkoutDirective.redirectToCheckout = jest.fn(
            async () => new Promise(res => setTimeout(res, 10))
        );
        basketStore.patchState({
            items: [
                {
                    itemId: '1',
                    quantity: 1
                }
            ]
        });

        button.click();
        button.click();
        button.click();
        button.click();
        jest.advanceTimersByTime(10);

        expect(
            component.checkoutDirective.redirectToCheckout
        ).toHaveBeenCalledTimes(1);
        expect(component.checkoutDirective.redirectToCheckout).toBeCalledWith([
            {
                itemId: '1',
                quantity: 1
            }
        ]);
    });
});
