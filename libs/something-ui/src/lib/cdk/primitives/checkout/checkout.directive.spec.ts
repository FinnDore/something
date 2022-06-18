import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { S_UI_CHECKOUT_PROVIDER } from '../../injection-tokens/checkout.token';
import { BasketStore } from '../../stores/basket-store/basket.store';
import { StripeCheckoutStore } from '../../stores/checkouts/stripe-checkout/stripe-checkout.store';
import { ShopStore } from '../../stores/shop-store/shop.store';
import { Writeable } from '../../utils/models/writeable.model';
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
    let checkoutProvider: Writeable<StripeCheckoutStore>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent],
            providers: [
                ShopStore,
                BasketStore,
                {
                    provide: S_UI_CHECKOUT_PROVIDER,
                    useValue: StripeCheckoutStore
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        basketStore = TestBed.inject(BasketStore);
        button = fixture.debugElement.query(By.css('button')).nativeElement;
        component = fixture.componentInstance;

        checkoutProvider = TestBed.inject<Writeable<StripeCheckoutStore>>(
            S_UI_CHECKOUT_PROVIDER
        );

        fixture.changeDetectorRef.detectChanges();
        if (component.checkoutDirective) {
            checkoutProvider.checkout = jest.fn();
            checkoutFn = checkoutProvider.checkout as jest.Mock<
                unknown,
                unknown[]
            >;
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
        expect(checkoutFn).toBeCalledWith({
            items: [
                {
                    itemId: '1',
                    quantity: 1
                }
            ]
        });
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
        expect(checkoutFn).toBeCalledWith({
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
    });

    it('should add the checkout options the the current items in the basket', () => {
        expect(component.checkoutDirective).not.toBeNull();
        if (!component.checkoutDirective) {
            return;
        }
        const firstOpts = {
            options: {
                payment: 'Subscription'
            }
        };
        const firstItems = [
            {
                itemId: '1',
                quantity: 2
            }
        ];

        basketStore.patchState({ items: firstItems });

        component.checkoutDirective.checkoutOptions = {
            options: {
                payment: 'Subscription'
            }
        };
        button.click();

        expect(checkoutFn).toHaveBeenCalledTimes(1);
        expect(checkoutFn).toBeCalledWith({
            items: firstItems,
            ...firstOpts
        });

        const newOpts = {
            items: [
                {
                    itemId: '2',
                    quantity: 2
                }
            ],
            options: {
                payment: 'Subscription'
            }
        };
        component.checkoutDirective.checkoutOptions = newOpts;
        button.click();

        expect(checkoutFn).toHaveBeenCalledTimes(2);
        expect(checkoutFn).toBeCalledWith(newOpts);
    });
});
