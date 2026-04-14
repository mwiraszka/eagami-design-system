import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { CodeInputComponent } from './code-input.component';

const meta: Meta<CodeInputComponent> = {
  title: 'Components/Code input',
  component: CodeInputComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-code-input ${argsToTemplate(args)}></ea-code-input>`,
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
    length: {
      control: { type: 'number', min: 4, max: 8, step: 1 },
    },
    completed: { action: 'completed' },
  },
  args: {
    label: 'Verification code',
    length: 6,
    size: 'md',
    status: 'default',
    disabled: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj<CodeInputComponent>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: 'Check your email for the 6-digit code',
  },
};

export const WithError: Story = {
  args: {
    errorMsg: 'Invalid verification code',
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

export const FourDigit: Story = {
  args: {
    label: 'PIN',
    length: 4,
    hint: 'Enter your 4-digit PIN',
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Required: Story = {
  args: { required: true },
};

export const Prefilled: Story = {
  args: {
    value: '123456',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="story-stack story-stack--lg">
        <ea-code-input size="sm" label="Small"></ea-code-input>
        <ea-code-input size="md" label="Medium"></ea-code-input>
        <ea-code-input size="lg" label="Large"></ea-code-input>
      </div>
    `,
  }),
};
