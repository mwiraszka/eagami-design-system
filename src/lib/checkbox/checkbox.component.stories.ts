import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { CheckboxComponent } from './checkbox.component';

const meta: Meta<CheckboxComponent> = {
  title: 'Components/Checkbox',
  component: CheckboxComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-checkbox ${argsToTemplate(args)}></ea-checkbox>`,
  }),
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    changed: { action: 'changed' },
  },
  args: {
    label: 'Accept terms and conditions',
    size: 'md',
    checked: false,
    disabled: false,
    indeterminate: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj<CheckboxComponent>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <ea-checkbox size="sm" label="Small checkbox"></ea-checkbox>
        <ea-checkbox size="md" label="Medium checkbox"></ea-checkbox>
        <ea-checkbox size="lg" label="Large checkbox"></ea-checkbox>
      </div>
    `,
  }),
};
