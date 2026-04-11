import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { SwitchComponent } from './switch.component';

const meta: Meta<SwitchComponent> = {
  title: 'Components/Switch',
  component: SwitchComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-switch ${argsToTemplate(args)} />`,
  }),
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    changed: { action: 'changed' },
  },
  args: {
    label: 'Toggle me',
    size: 'md',
    checked: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<SwitchComponent>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { checked: true, disabled: true },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="story-stack">
        <ea-switch size="sm" label="Small" />
        <ea-switch size="md" label="Medium" />
        <ea-switch size="lg" label="Large" />
      </div>
    `,
  }),
};
