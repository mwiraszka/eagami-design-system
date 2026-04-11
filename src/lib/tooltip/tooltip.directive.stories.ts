import { Meta, StoryObj } from '@storybook/angular';

import { ButtonComponent } from '../button/button.component';
import { TooltipDirective } from './tooltip.directive';

const meta: Meta<TooltipDirective> = {
  title: 'Components/Tooltip',
  component: TooltipDirective,
  tags: ['autodocs'],
  argTypes: {
    tooltipPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<TooltipDirective>;

export const Default: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [ButtonComponent, TooltipDirective],
    },
    template: `
      <div style="display: flex; justify-content: center; padding: 64px;">
        <ea-button eaTooltip="This is a tooltip" variant="secondary">Hover me</ea-button>
      </div>
    `,
  }),
};

export const AllPositions: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [ButtonComponent, TooltipDirective],
    },
    template: `
      <div style="display: flex; justify-content: center; gap: 16px; padding: 64px;">
        <ea-button eaTooltip="Top tooltip" tooltipPosition="top" variant="secondary">Top</ea-button>
        <ea-button eaTooltip="Bottom tooltip" tooltipPosition="bottom" variant="secondary">Bottom</ea-button>
        <ea-button eaTooltip="Left tooltip" tooltipPosition="left" variant="secondary">Left</ea-button>
        <ea-button eaTooltip="Right tooltip" tooltipPosition="right" variant="secondary">Right</ea-button>
      </div>
    `,
  }),
};
