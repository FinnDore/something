import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ItemComponent } from './item.component';

export default {
  title: 'ItemComponent',
  component: ItemComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<ItemComponent>;

const Template: Story<ItemComponent> = (args: ItemComponent) => ({
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
}