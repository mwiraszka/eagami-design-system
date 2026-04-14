import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { DatePickerComponent } from './date-picker.component';

const meta: Meta<DatePickerComponent> = {
  title: 'Components/Date picker',
  component: DatePickerComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-date-picker ${argsToTemplate(args)} class="story-narrow"></ea-date-picker>`,
  }),
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    format: {
      control: 'select',
      options: ['short', 'medium', 'long'],
    },
    weekStartsOn: {
      control: 'select',
      options: [0, 1],
    },
    changed: { action: 'changed' },
  },
  args: {
    label: 'Date',
    placeholder: 'Select date…',
    size: 'md',
    format: 'medium',
    weekStartsOn: 1,
    disabled: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj<DatePickerComponent>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: 'Pick any date in the future.',
  },
};

export const WithError: Story = {
  args: {
    errorMsg: 'This field is required.',
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

export const WithInitialValue: Story = {
  args: {
    value: new Date(),
  },
};

export const WithMinMax: Story = {
  args: {
    minDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    maxDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    hint: 'Restricted to ±1 week / +2 weeks from today.',
  },
};

export const ShortFormat: Story = {
  args: { format: 'short', value: new Date() },
};

export const LongFormat: Story = {
  args: { format: 'long', value: new Date() },
};

export const SundayStart: Story = {
  args: { weekStartsOn: 0 },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="story-stack story-narrow">
        <ea-date-picker size="sm" label="Small" placeholder="Select…"></ea-date-picker>
        <ea-date-picker size="md" label="Medium" placeholder="Select…"></ea-date-picker>
        <ea-date-picker size="lg" label="Large" placeholder="Select…"></ea-date-picker>
      </div>
    `,
  }),
};
