import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { AutocompleteComponent } from './autocomplete.component';

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'br', label: 'Brazil' },
  { value: 'ar', label: 'Argentina' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'pl', label: 'Poland' },
  { value: 'jp', label: 'Japan' },
  { value: 'kr', label: 'South Korea' },
  { value: 'cn', label: 'China' },
  { value: 'in', label: 'India' },
  { value: 'au', label: 'Australia' },
  { value: 'nz', label: 'New Zealand' },
];

const meta: Meta<AutocompleteComponent> = {
  title: 'Components/Autocomplete',
  component: AutocompleteComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-autocomplete ${argsToTemplate(args)}></ea-autocomplete>`,
  }),
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    optionSelected: { action: 'optionSelected' },
    valueChanged: { action: 'valueChanged' },
  },
  args: {
    label: 'Country',
    placeholder: 'Start typing…',
    options: countries,
    size: 'md',
    disabled: false,
    required: false,
    minLength: 0,
    maxResults: 10,
    emptyMessage: 'No results',
  },
};

export default meta;
type Story = StoryObj<AutocompleteComponent>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'Start typing to see suggestions' },
};

export const WithError: Story = {
  args: { errorMsg: 'Please select a valid option' },
};

export const Required: Story = {
  args: { required: true, label: 'Country (required)' },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'United States' },
};

export const MinLength: Story = {
  args: {
    minLength: 2,
    hint: 'Type at least 2 characters',
  },
};

export const MaxResults: Story = {
  args: {
    maxResults: 3,
    hint: 'Showing top 3 matches',
  },
};

export const SmallSize: Story = {
  args: { size: 'sm' },
};

export const LargeSize: Story = {
  args: { size: 'lg' },
};
