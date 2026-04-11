import { Meta, StoryObj } from '@storybook/angular';

import { RadioGroupComponent } from './radio-group.component';
import { RadioComponent } from './radio.component';

const meta: Meta<RadioGroupComponent> = {
  title: 'Components/Radio',
  component: RadioGroupComponent,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    changed: { action: 'changed' },
  },
  args: {
    size: 'md',
    orientation: 'vertical',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<RadioGroupComponent>;

export const Default: Story = {
  render: args => ({
    props: args,
    moduleMetadata: { imports: [RadioGroupComponent, RadioComponent] },
    template: `
      <ea-radio-group [size]="size" [orientation]="orientation" [disabled]="disabled">
        <ea-radio value="apple" label="Apple"></ea-radio>
        <ea-radio value="banana" label="Banana"></ea-radio>
        <ea-radio value="cherry" label="Cherry"></ea-radio>
      </ea-radio-group>
    `,
  }),
};

export const Horizontal: Story = {
  render: args => ({
    props: { ...args, orientation: 'horizontal' },
    moduleMetadata: { imports: [RadioGroupComponent, RadioComponent] },
    template: `
      <ea-radio-group [size]="size" orientation="horizontal" [disabled]="disabled">
        <ea-radio value="sm" label="Small"></ea-radio>
        <ea-radio value="md" label="Medium"></ea-radio>
        <ea-radio value="lg" label="Large"></ea-radio>
      </ea-radio-group>
    `,
  }),
};

export const WithDisabledOption: Story = {
  render: args => ({
    props: args,
    moduleMetadata: { imports: [RadioGroupComponent, RadioComponent] },
    template: `
      <ea-radio-group [size]="size" [orientation]="orientation">
        <ea-radio value="a" label="Available"></ea-radio>
        <ea-radio value="b" label="Also available"></ea-radio>
        <ea-radio value="c" label="Unavailable" [disabled]="true"></ea-radio>
      </ea-radio-group>
    `,
  }),
};

export const Disabled: Story = {
  render: args => ({
    props: args,
    moduleMetadata: { imports: [RadioGroupComponent, RadioComponent] },
    template: `
      <ea-radio-group [size]="size" [orientation]="orientation" [disabled]="true" value="a">
        <ea-radio value="a" label="Option A"></ea-radio>
        <ea-radio value="b" label="Option B"></ea-radio>
      </ea-radio-group>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [RadioGroupComponent, RadioComponent] },
    template: `
      <div class="story-row story-row--xl">
        <ea-radio-group size="sm" value="a">
          <ea-radio value="a" label="Small A"></ea-radio>
          <ea-radio value="b" label="Small B"></ea-radio>
        </ea-radio-group>
        <ea-radio-group size="md" value="a">
          <ea-radio value="a" label="Medium A"></ea-radio>
          <ea-radio value="b" label="Medium B"></ea-radio>
        </ea-radio-group>
        <ea-radio-group size="lg" value="a">
          <ea-radio value="a" label="Large A"></ea-radio>
          <ea-radio value="b" label="Large B"></ea-radio>
        </ea-radio-group>
      </div>
    `,
  }),
};
