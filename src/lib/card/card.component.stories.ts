import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { CardComponent } from './card.component';

const meta: Meta<CardComponent> = {
  title: 'Components/Card',
  component: CardComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `
      <ea-card ${argsToTemplate(args)} class="story-narrow">
        <span eaCardHeader>Card Title</span>
        This is the card body content. It can contain any text or elements.
        <span eaCardFooter>Footer</span>
      </ea-card>
    `,
  }),
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    headerAlign: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
  },
  args: {
    variant: 'elevated',
    padding: 'md',
    fullWidth: false,
    headerAlign: 'center',
  },
};

export default meta;
type Story = StoryObj<CardComponent>;

export const Elevated: Story = {};

export const Outlined: Story = {
  args: { variant: 'outlined' },
};

export const Filled: Story = {
  args: { variant: 'filled' },
};

export const SmallPadding: Story = {
  args: { padding: 'sm' },
};

export const LargePadding: Story = {
  args: { padding: 'lg' },
};

export const NoPadding: Story = {
  args: { padding: 'none' },
};

export const BodyOnly: Story = {
  render: args => ({
    props: args,
    template: `
      <ea-card ${argsToTemplate(args)} class="story-narrow">
        Simple card with body content only — no header or footer.
      </ea-card>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="story-card-grid">
        <ea-card variant="elevated">
          <span eaCardHeader>Elevated</span>
          Card with shadow elevation.
        </ea-card>
        <ea-card variant="outlined">
          <span eaCardHeader>Outlined</span>
          Card with border outline.
        </ea-card>
        <ea-card variant="filled">
          <span eaCardHeader>Filled</span>
          Card with subtle background.
        </ea-card>
      </div>
    `,
  }),
};
