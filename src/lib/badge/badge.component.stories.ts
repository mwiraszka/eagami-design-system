import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { BadgeComponent } from './badge.component';

const meta: Meta<BadgeComponent> = {
  title: 'Components/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-badge ${argsToTemplate(args)}>Badge</ea-badge>`,
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
  },
  args: {
    variant: 'default',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<BadgeComponent>;

export const Default: Story = {};

export const Success: Story = {
  args: { variant: 'success' },
  render: args => ({
    props: args,
    template: `<ea-badge ${argsToTemplate(args)}>Success</ea-badge>`,
  }),
};

export const Warning: Story = {
  args: { variant: 'warning' },
  render: args => ({
    props: args,
    template: `<ea-badge ${argsToTemplate(args)}>Warning</ea-badge>`,
  }),
};

export const Error: Story = {
  args: { variant: 'error' },
  render: args => ({
    props: args,
    template: `<ea-badge ${argsToTemplate(args)}>Error</ea-badge>`,
  }),
};

export const Info: Story = {
  args: { variant: 'info' },
  render: args => ({
    props: args,
    template: `<ea-badge ${argsToTemplate(args)}>Info</ea-badge>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="story-row">
        <ea-badge variant="default">Default</ea-badge>
        <ea-badge variant="success">Success</ea-badge>
        <ea-badge variant="warning">Warning</ea-badge>
        <ea-badge variant="error">Error</ea-badge>
        <ea-badge variant="info">Info</ea-badge>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="story-row">
        <ea-badge size="sm">Small</ea-badge>
        <ea-badge size="md">Medium</ea-badge>
        <ea-badge size="lg">Large</ea-badge>
      </div>
    `,
  }),
};
