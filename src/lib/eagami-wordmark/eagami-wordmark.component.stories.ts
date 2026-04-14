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
    variant: {
      control: 'select',
      options: ['logo', 'signature', 'brand'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    variant: 'brand',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<EagamiWordmarkComponent>;

export const Default: Story = {};

export const Logo: Story = {
  args: { variant: 'logo', size: 'md' },
};

export const Signature: Story = {
  args: { variant: 'signature', size: 'md' },
};

export const Brand: Story = {
  args: { variant: 'brand', size: 'md' },
};

export const Small: Story = {
  args: { variant: 'brand', size: 'sm' },
};

export const Large: Story = {
  args: { variant: 'brand', size: 'lg' },
};
