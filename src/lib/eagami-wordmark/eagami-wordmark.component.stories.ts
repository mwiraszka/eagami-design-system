import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { EagamiWordmarkComponent } from './eagami-wordmark.component';

const meta: Meta<EagamiWordmarkComponent> = {
  title: 'Components/Eagami wordmark',
  component: EagamiWordmarkComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-eagami-wordmark ${argsToTemplate(args)}></ea-eagami-wordmark>`,
  }),
  argTypes: {
    text: {
      control: 'select',
      options: [
        'eagami',
        'handcrafted by eagami',
        'eagami design system',
        'eagami design system \u2014 elegant web design',
      ],
    },
    layout: {
      control: 'inline-radio',
      options: ['stacked', 'inline'],
    },
    size: {
      control: { type: 'number', min: 16, step: 8 },
    },
  },
  args: {
    text: 'eagami',
    layout: 'stacked',
    size: 32,
  },
};

export default meta;
type Story = StoryObj<EagamiWordmarkComponent>;

export const Default: Story = {};

export const HandcraftedBy: Story = {
  args: { text: 'handcrafted by eagami' },
};

export const DesignSystem: Story = {
  args: { text: 'eagami design system' },
};

export const Full: Story = {
  args: { text: 'eagami design system \u2014 elegant web design' },
};

export const Small: Story = {
  args: { text: 'eagami design system', size: 32 },
};

export const Large: Story = {
  args: {
    text: 'eagami design system \u2014 elegant web design',
    size: 96,
  },
};

export const InlineHandcraftedBy: Story = {
  args: { text: 'handcrafted by eagami', layout: 'inline' },
};

export const InlineFull: Story = {
  args: {
    text: 'eagami design system \u2014 elegant web design',
    layout: 'inline',
  },
};
