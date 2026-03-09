import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { InputComponent } from './input.component';

const meta: Meta<InputComponent> = {
  title: 'Components/Input',
  component: InputComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-input ${argsToTemplate(args)} style="max-width: 360px; display: block;"></ea-input>`,
  }),
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    status: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    inputFocused: { action: 'focused' },
    inputBlurred: { action: 'blurred' },
  },
  args: {
    label: 'Label',
    placeholder: 'Enter text…',
    size: 'md',
    status: 'default',
    type: 'text',
    disabled: false,
    readonly: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: 'Helpful guidance goes here.',
  },
};

export const WithError: Story = {
  args: {
    errorMsg: 'This field is required.',
  },
};

export const Success: Story = {
  args: {
    status: 'success',
  },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password…',
    errorMsg: 'Password must be at least 8 characters.',
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  args: {
    readonly: true,
  },
};

export const Required: Story = {
  args: {
    required: true,
    label: 'Email address',
    type: 'email',
    placeholder: 'you@example.com',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 360px;">
        <ea-input size="sm" label="Small" placeholder="Small input"></ea-input>
        <ea-input size="md" label="Medium" placeholder="Medium input"></ea-input>
        <ea-input size="lg" label="Large" placeholder="Large input"></ea-input>
      </div>
    `,
  }),
};
