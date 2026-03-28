import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { SkeletonComponent } from './skeleton.component';

const meta: Meta<SkeletonComponent> = {
  title: 'Components/Skeleton',
  component: SkeletonComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-skeleton ${argsToTemplate(args)}></ea-skeleton>`,
  }),
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circle', 'rect'],
    },
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: {
    variant: 'text',
    animated: true,
  },
};

export default meta;
type Story = StoryObj<SkeletonComponent>;

export const Text: Story = {};

export const Circle: Story = {
  args: { variant: 'circle' },
};

export const Rect: Story = {
  args: { variant: 'rect' },
};

export const CustomSize: Story = {
  args: { variant: 'rect', width: '200px', height: '120px' },
};

export const NotAnimated: Story = {
  args: { animated: false },
};

export const CardPlaceholder: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 320px; padding: 1rem; border: 1px solid var(--color-border-default); border-radius: var(--radius-lg);">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <ea-skeleton variant="circle"></ea-skeleton>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
            <ea-skeleton width="60%"></ea-skeleton>
            <ea-skeleton width="40%" height="0.75rem"></ea-skeleton>
          </div>
        </div>
        <ea-skeleton variant="rect" height="8rem"></ea-skeleton>
        <ea-skeleton></ea-skeleton>
        <ea-skeleton width="75%"></ea-skeleton>
      </div>
    `,
  }),
};
