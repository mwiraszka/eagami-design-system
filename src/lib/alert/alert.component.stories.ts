import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { AlertComponent } from './alert.component';

const meta: Meta<AlertComponent> = {
  title: 'Components/Alert',
  component: AlertComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-alert ${argsToTemplate(args)}>This is an alert message.</ea-alert>`,
  }),
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
    dismissed: { action: 'dismissed' },
  },
  args: {
    variant: 'default',
    dismissible: false,
  },
};

export default meta;
type Story = StoryObj<AlertComponent>;

export const Default: Story = {};

export const Success: Story = {
  args: { variant: 'success' },
  render: args => ({
    props: args,
    template: `<ea-alert ${argsToTemplate(args)}>Your changes have been saved</ea-alert>`,
  }),
};

export const Warning: Story = {
  args: { variant: 'warning' },
  render: args => ({
    props: args,
    template: `<ea-alert ${argsToTemplate(args)}>Your trial expires in 3 days</ea-alert>`,
  }),
};

export const Error: Story = {
  args: { variant: 'error' },
  render: args => ({
    props: args,
    template: `<ea-alert ${argsToTemplate(args)}>Something went wrong. Please try again</ea-alert>`,
  }),
};

export const Info: Story = {
  args: { variant: 'info' },
  render: args => ({
    props: args,
    template: `<ea-alert ${argsToTemplate(args)}>A new version is available</ea-alert>`,
  }),
};

export const Dismissible: Story = {
  args: { variant: 'info', dismissible: true },
  render: args => ({
    props: args,
    template: `<ea-alert ${argsToTemplate(args)}>This alert can be dismissed</ea-alert>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 480px;">
        <ea-alert variant="default">Default alert message</ea-alert>
        <ea-alert variant="success">Success alert message</ea-alert>
        <ea-alert variant="warning">Warning alert message</ea-alert>
        <ea-alert variant="error">Error alert message</ea-alert>
        <ea-alert variant="info">Info alert message</ea-alert>
      </div>
    `,
  }),
};
