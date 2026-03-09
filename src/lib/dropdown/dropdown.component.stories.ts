import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { DropdownComponent } from './dropdown.component';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

const meta: Meta<DropdownComponent> = {
  title: 'Components/Dropdown',
  component: DropdownComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-dropdown ${argsToTemplate(args)} style="max-width: 360px; display: block;"></ea-dropdown>`,
  }),
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    changed: { action: 'changed' },
  },
  args: {
    label: 'Fruit',
    placeholder: 'Select a fruit…',
    options: fruitOptions,
    size: 'md',
    disabled: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj<DropdownComponent>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: 'Choose your favourite fruit.',
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

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry (sold out)', disabled: true },
    ],
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 360px;">
        <ea-dropdown size="sm" label="Small" [options]="options" placeholder="Select…"></ea-dropdown>
        <ea-dropdown size="md" label="Medium" [options]="options" placeholder="Select…"></ea-dropdown>
        <ea-dropdown size="lg" label="Large" [options]="options" placeholder="Select…"></ea-dropdown>
      </div>
    `,
    props: { options: fruitOptions },
  }),
};
