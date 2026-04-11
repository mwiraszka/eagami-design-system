import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { SpinnerComponent } from './spinner.component';

const meta: Meta<SpinnerComponent> = {
  title: 'Components/Spinner',
  component: SpinnerComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-spinner ${argsToTemplate(args)} />`,
  }),
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    size: 'md',
    label: 'Loading',
  },
};

export default meta;
type Story = StoryObj<SpinnerComponent>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const CustomLabel: Story = {
  args: { label: 'Please wait...' },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="story-row">
        <ea-spinner size="sm" />
        <ea-spinner size="md" />
        <ea-spinner size="lg" />
      </div>
    `,
  }),
};
