import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { BasketStore } from '../stores/basket-store/basket.store';
import { ItemStore } from '../stores/item-store/item.store';
import { ShopStore } from '../stores/shop-store/shop.store';
import { ItemComponent, ItemComponentModule } from './item.component';

export default {
    title: 'ItemComponent',
    component: ItemComponent,
    decorators: [
        moduleMetadata({
            imports: [ItemComponentModule],
            providers: []
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
