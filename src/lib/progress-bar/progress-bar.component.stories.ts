import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { ProgressBarComponent } from './progress-bar.component';

const meta: Meta<ProgressBarComponent> = {
  title: 'Components/Progress bar',
  component: ProgressBarComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-progress-bar ${argsToTemplate(args)} />`,
  }),
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: { type: 'number', min: 1 } },
  },
  args: {
    value: 60,
    max: 100,
    variant: 'default',
    size: 'md',
    label: '',
    showValue: false,
    indeterminate: false,
  },
};

export default meta;
type Story = StoryObj<ProgressBarComponent>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: 'Uploading files', showValue: true, value: 72 },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Processing…' },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="story-stack story-medium">
        <ea-progress-bar variant="default" [value]="60" label="Default" [showValue]="true" />
        <ea-progress-bar variant="success" [value]="100" label="Success" [showValue]="true" />
        <ea-progress-bar variant="warning" [value]="45" label="Warning" [showValue]="true" />
        <ea-progress-bar variant="error" [value]="20" label="Error" [showValue]="true" />
        <ea-progress-bar variant="info" [value]="80" label="Info" [showValue]="true" />
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="story-stack story-medium">
        <ea-progress-bar size="sm" [value]="60" label="Small" />
        <ea-progress-bar size="md" [value]="60" label="Medium" />
        <ea-progress-bar size="lg" [value]="60" label="Large" />
      </div>
    `,
  }),
};
