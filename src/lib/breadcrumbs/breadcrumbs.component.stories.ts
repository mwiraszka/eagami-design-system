import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { BreadcrumbsComponent } from './breadcrumbs.component';

const sampleItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Laptops', href: '/products/laptops' },
  { label: 'MacBook Pro' },
];

const meta: Meta<BreadcrumbsComponent> = {
  title: 'Components/Breadcrumbs',
  component: BreadcrumbsComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-breadcrumbs ${argsToTemplate(args)}></ea-breadcrumbs>`,
  }),
  argTypes: {
    separator: {
      control: 'select',
      options: ['chevron', 'slash'],
    },
    itemClicked: { action: 'itemClicked' },
  },
  args: {
    items: sampleItems,
    separator: 'chevron',
  },
};

export default meta;
type Story = StoryObj<BreadcrumbsComponent>;

export const Default: Story = {};

export const SlashSeparator: Story = {
  args: { separator: 'slash' },
};

export const TwoLevels: Story = {
  args: {
    items: [{ label: 'Dashboard', href: '/' }, { label: 'Settings' }],
  },
};

export const ManyLevels: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Docs', href: '/docs' },
      { label: 'Components', href: '/docs/components' },
      { label: 'Form', href: '/docs/components/form' },
      { label: 'Input' },
    ],
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Archive', href: '/archive', disabled: true },
      { label: 'Old post' },
    ],
  },
};

export const ButtonItems: Story = {
  args: {
    items: [{ label: 'Workspace' }, { label: 'Project' }, { label: 'Task' }],
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Home' }],
  },
};
