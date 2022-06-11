import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule } from '@taiga-ui/core';
import { AddToBasketDirectiveModule } from '../primitives/add-to-basket/add-to-basket.directive';
import { ItemDirectiveModule } from '../primitives/item/item.directive';
import { BasketStore } from '../stores/basket-store/basket.store';
import { ItemStore } from '../stores/item-store/item.store';
import { ShopStore } from '../stores/shop-store/shop.store';
import { UnsubscribeModule } from '../utils/angular/unsubscribe';
import { ItemComponent } from './item.component';

describe('ItemComponent', () => {
    let component: ItemComponent;
    let fixture: ComponentFixture<ItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                TuiButtonModule,
                ReactiveComponentModule,
                UnsubscribeModule,
                AddToBasketDirectiveModule,
                ItemDirectiveModule
            ],
            providers: [ShopStore, BasketStore, ItemStore],
            declarations: [ItemComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
