import { Meta, StoryObj } from '@storybook/angular';

import { ButtonComponent } from '../button/button.component';
import { DialogComponent } from './dialog.component';

const meta: Meta<DialogComponent> = {
  title: 'Components/Dialog',
  component: DialogComponent,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
    },
    opened: { action: 'opened' },
    closed: { action: 'closed' },
  },
  args: {
    size: 'md',
    closeOnBackdrop: true,
    closeOnEscape: true,
    showClose: true,
  },
};

export default meta;
type Story = StoryObj<DialogComponent>;

export const Default: Story = {
  render: args => ({
    props: { ...args, isOpen: false },
    moduleMetadata: { imports: [DialogComponent, ButtonComponent] },
    template: `
      <ea-button (clicked)="isOpen = true">Open Dialog</ea-button>
      <ea-dialog
        [(open)]="isOpen"
        [size]="size"
        [closeOnBackdrop]="closeOnBackdrop"
        [closeOnEscape]="closeOnEscape"
        [showClose]="showClose">
        <span slot="header">Dialog Title</span>
        <p>This is the dialog body content. You can put anything here.</p>
        <div slot="footer">
          <ea-button variant="secondary" (clicked)="isOpen = false">Cancel</ea-button>
          <ea-button (clicked)="isOpen = false">Confirm</ea-button>
        </div>
      </ea-dialog>
    `,
  }),
};

export const Small: Story = {
  render: args => ({
    props: { ...args, isOpen: false, size: 'sm' },
    moduleMetadata: { imports: [DialogComponent, ButtonComponent] },
    template: `
      <ea-button (clicked)="isOpen = true">Open Small Dialog</ea-button>
      <ea-dialog [(open)]="isOpen" size="sm">
        <span slot="header">Small Dialog</span>
        <p>A compact dialog for simple confirmations.</p>
        <div slot="footer">
          <ea-button variant="secondary" (clicked)="isOpen = false">Cancel</ea-button>
          <ea-button (clicked)="isOpen = false">OK</ea-button>
        </div>
      </ea-dialog>
    `,
  }),
};

export const Large: Story = {
  render: args => ({
    props: { ...args, isOpen: false, size: 'lg' },
    moduleMetadata: { imports: [DialogComponent, ButtonComponent] },
    template: `
      <ea-button (clicked)="isOpen = true">Open Large Dialog</ea-button>
      <ea-dialog [(open)]="isOpen" size="lg">
        <span slot="header">Large Dialog</span>
        <p>A larger dialog for more detailed content, forms, or data tables.</p>
        <div slot="footer">
          <ea-button variant="secondary" (clicked)="isOpen = false">Cancel</ea-button>
          <ea-button (clicked)="isOpen = false">Save</ea-button>
        </div>
      </ea-dialog>
    `,
  }),
};

export const NoCloseButton: Story = {
  render: args => ({
    props: { ...args, isOpen: false },
    moduleMetadata: { imports: [DialogComponent, ButtonComponent] },
    template: `
      <ea-button (clicked)="isOpen = true">Open Dialog</ea-button>
      <ea-dialog [(open)]="isOpen" [showClose]="false">
        <span slot="header">No Close Button</span>
        <p>This dialog has no close button. Use the footer actions to dismiss.</p>
        <div slot="footer">
          <ea-button (clicked)="isOpen = false">Dismiss</ea-button>
        </div>
      </ea-dialog>
    `,
  }),
};
