import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Components/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-button ${argsToTemplate(args)}>Button</ea-button>`,
  }),
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
    clicked: { action: 'clicked' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Danger: Story = {
  args: { variant: 'danger' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <ea-button variant="primary">Primary</ea-button>
        <ea-button variant="secondary">Secondary</ea-button>
        <ea-button variant="ghost">Ghost</ea-button>
        <ea-button variant="danger">Danger</ea-button>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 0.75rem; align-items: center;">
        <ea-button size="sm">Small</ea-button>
        <ea-button size="md">Medium</ea-button>
        <ea-button size="lg">Large</ea-button>
      </div>
    `,
  }),
};
