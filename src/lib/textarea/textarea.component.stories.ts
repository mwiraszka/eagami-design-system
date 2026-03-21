import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { TextareaComponent } from './textarea.component';

const meta: Meta<TextareaComponent> = {
  title: 'Components/Textarea',
  component: TextareaComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-textarea ${argsToTemplate(args)} style="max-width: 360px; display: block;"></ea-textarea>`,
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
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
    textareaFocused: { action: 'focused' },
    textareaBlurred: { action: 'blurred' },
  },
  args: {
    label: 'Message',
    placeholder: 'Enter your message…',
    size: 'md',
    status: 'default',
    rows: 3,
    resize: 'vertical',
    disabled: false,
    readonly: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj<TextareaComponent>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: 'Maximum 500 characters.',
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

export const Disabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  args: {
    readonly: true,
    value: 'This content cannot be edited.',
  },
};

export const NoResize: Story = {
  args: {
    resize: 'none',
    label: 'Fixed size',
  },
};

export const WithMaxlength: Story = {
  args: {
    maxlength: 100,
    hint: 'Limited to 100 characters.',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 360px;">
        <ea-textarea size="sm" label="Small" placeholder="Small textarea"></ea-textarea>
        <ea-textarea size="md" label="Medium" placeholder="Medium textarea"></ea-textarea>
        <ea-textarea size="lg" label="Large" placeholder="Large textarea"></ea-textarea>
      </div>
    `,
  }),
};
