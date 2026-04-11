import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { AvatarComponent } from './avatar.component';

const meta: Meta<AvatarComponent> = {
  title: 'Components/Avatar',
  component: AvatarComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-avatar ${argsToTemplate(args)} />`,
  }),
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    shape: {
      control: 'select',
      options: ['circle', 'square'],
    },
  },
  args: {
    size: 'md',
    shape: 'circle',
  },
};

export default meta;
type Story = StoryObj<AvatarComponent>;

export const Default: Story = {};

export const WithInitials: Story = {
  args: { initials: 'MW' },
};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    alt: 'User avatar',
  },
};

export const Square: Story = {
  args: {
    initials: 'EA',
    shape: 'square',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="story-row">
        <ea-avatar size="xs" initials="XS" />
        <ea-avatar size="sm" initials="SM" />
        <ea-avatar size="md" initials="MD" />
        <ea-avatar size="lg" initials="LG" />
        <ea-avatar size="xl" initials="XL" />
      </div>
    `,
  }),
};

export const AllShapes: Story = {
  render: () => ({
    template: `
      <div class="story-row">
        <ea-avatar shape="circle" initials="CI" />
        <ea-avatar shape="square" initials="SQ" />
      </div>
    `,
  }),
};
