import { Meta, moduleMetadata, Story } from '@storybook/angular';
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
