import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { TagComponent } from './tag.component';

const meta: Meta<TagComponent> = {
  title: 'Components/Tag',
  component: TagComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-tag ${argsToTemplate(args)}>TypeScript</ea-tag>`,
  }),
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error', 'info'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    removed: { action: 'removed' },
  },
  args: {
    variant: 'default',
    size: 'md',
    removable: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<TagComponent>;

export const Default: Story = {};

export const Removable: Story = {
  args: { removable: true },
};

export const Disabled: Story = {
  args: { removable: true, disabled: true },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="story-row story-row--sm">
        <ea-tag variant="default">Default</ea-tag>
        <ea-tag variant="primary">Primary</ea-tag>
        <ea-tag variant="success">Success</ea-tag>
        <ea-tag variant="warning">Warning</ea-tag>
        <ea-tag variant="error">Error</ea-tag>
        <ea-tag variant="info">Info</ea-tag>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="story-row story-row--sm">
        <ea-tag size="sm">Small</ea-tag>
        <ea-tag size="md">Medium</ea-tag>
        <ea-tag size="lg">Large</ea-tag>
      </div>
    `,
  }),
};

export const RemovableVariants: Story = {
  render: () => ({
    template: `
      <div class="story-row story-row--sm">
        <ea-tag variant="default" [removable]="true">Default</ea-tag>
        <ea-tag variant="primary" [removable]="true">Primary</ea-tag>
        <ea-tag variant="success" [removable]="true">Success</ea-tag>
        <ea-tag variant="warning" [removable]="true">Warning</ea-tag>
        <ea-tag variant="error" [removable]="true">Error</ea-tag>
        <ea-tag variant="info" [removable]="true">Info</ea-tag>
      </div>
    `,
  }),
};
