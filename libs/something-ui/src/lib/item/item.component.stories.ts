import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { BasketStore } from '../basket-store/basket.store';
import { ItemStore } from '../stores/item-store/item.store';
import { ShopStore } from '../shop-store/shop.store';
import { ItemComponent } from './item.component';

export default {
    title: 'ItemComponent',
    component: ItemComponent,
    decorators: [
        moduleMetadata({
            imports: [],
            providers: [ShopStore, BasketStore, ItemStore]
        })
    ],
    argTypes: {
        price: {
            control: { type: 'range', min: 1, max: 100 }
        }
    }
} as Meta<ItemComponent>;

const Template: Story<ItemComponent> = (args: ItemComponent) => ({
    props: args
});

export const Primary = Template.bind({});
Primary.args = {};
