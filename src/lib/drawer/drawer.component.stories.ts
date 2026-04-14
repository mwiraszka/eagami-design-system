import { Meta, StoryObj } from '@storybook/angular';

import { ButtonComponent } from '../button/button.component';
import { DrawerComponent } from './drawer.component';

const meta: Meta<DrawerComponent> = {
  title: 'Components/Drawer',
  component: DrawerComponent,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
    },
    opened: { action: 'opened' },
    closed: { action: 'closed' },
  },
  args: {
    position: 'right',
    size: 'md',
    closeOnBackdrop: true,
    closeOnEscape: true,
    showClose: true,
  },
};

export default meta;
type Story = StoryObj<DrawerComponent>;

export const Default: Story = {
  render: args => ({
    props: { ...args, isOpen: false },
    moduleMetadata: { imports: [DrawerComponent, ButtonComponent] },
    template: `
      <ea-button (clicked)="isOpen = true">Open Drawer</ea-button>
      <ea-drawer
        [(open)]="isOpen"
        [position]="position"
        [size]="size"
        [closeOnBackdrop]="closeOnBackdrop"
        [closeOnEscape]="closeOnEscape"
        [showClose]="showClose">
        <span slot="header">Drawer Title</span>
        <p>This is the drawer body content. Drawers slide in from the edge of the screen.</p>
        <div slot="footer">
          <ea-button variant="secondary" (clicked)="isOpen = false">
            Cancel
          </ea-button>
          <ea-button (clicked)="isOpen = false">
            Save
          </ea-button>
        </div>
      </ea-drawer>
    `,
  }),
};

export const Left: Story = {
  render: args => ({
    props: { ...args, isOpen: false },
    moduleMetadata: { imports: [DrawerComponent, ButtonComponent] },
    template: `
      <ea-button (clicked)="isOpen = true">Open Left Drawer</ea-button>
      <ea-drawer [(open)]="isOpen" position="left">
        <span slot="header">Left Drawer</span>
        <p>Slides in from the left edge — useful for navigation menus.</p>
        <div slot="footer">
          <ea-button (clicked)="isOpen = false">
            Close
          </ea-button>
        </div>
      </ea-drawer>
    `,
  }),
};

export const Top: Story = {
  render: args => ({
    props: { ...args, isOpen: false },
    moduleMetadata: { imports: [DrawerComponent, ButtonComponent] },
    template: `
      <ea-button (clicked)="isOpen = true">Open Top Drawer</ea-button>
      <ea-drawer [(open)]="isOpen" position="top">
        <span slot="header">Top Drawer</span>
        <p>Slides down from the top — useful for notifications or quick actions.</p>
        <div slot="footer">
          <ea-button (clicked)="isOpen = false">
            Close
          </ea-button>
        </div>
      </ea-drawer>
    `,
  }),
};

export const Bottom: Story = {
  render: args => ({
    props: { ...args, isOpen: false },
    moduleMetadata: { imports: [DrawerComponent, ButtonComponent] },
    template: `
      <ea-button (clicked)="isOpen = true">Open Bottom Drawer</ea-button>
      <ea-drawer [(open)]="isOpen" position="bottom">
        <span slot="header">Bottom Drawer</span>
        <p>Slides up from the bottom — common on mobile for action sheets.</p>
        <div slot="footer">
          <ea-button (clicked)="isOpen = false">
            Close
          </ea-button>
        </div>
      </ea-drawer>
    `,
  }),
};

export const Small: Story = {
  render: args => ({
    props: { ...args, isOpen: false },
    moduleMetadata: { imports: [DrawerComponent, ButtonComponent] },
    template: `
      <ea-button (clicked)="isOpen = true">Open Small Drawer</ea-button>
      <ea-drawer [(open)]="isOpen" size="sm">
        <span slot="header">Small Drawer</span>
        <p>A compact drawer for quick filters or settings.</p>
        <div slot="footer">
          <ea-button (clicked)="isOpen = false">
            Close
          </ea-button>
        </div>
      </ea-drawer>
    `,
  }),
};

export const Large: Story = {
  render: args => ({
    props: { ...args, isOpen: false },
    moduleMetadata: { imports: [DrawerComponent, ButtonComponent] },
    template: `
      <ea-button (clicked)="isOpen = true">Open Large Drawer</ea-button>
      <ea-drawer [(open)]="isOpen" size="lg">
        <span slot="header">Large Drawer</span>
        <p>A roomier drawer for forms, details, or richer content.</p>
        <div slot="footer">
          <ea-button variant="secondary" (clicked)="isOpen = false">
            Cancel
          </ea-button>
          <ea-button (clicked)="isOpen = false">
            Save
          </ea-button>
        </div>
      </ea-drawer>
    `,
  }),
};

export const NoCloseButton: Story = {
  render: args => ({
    props: { ...args, isOpen: false },
    moduleMetadata: { imports: [DrawerComponent, ButtonComponent] },
    template: `
      <ea-button (clicked)="isOpen = true">Open Drawer</ea-button>
      <ea-drawer [(open)]="isOpen" [showClose]="false">
        <span slot="header">No Close Button</span>
        <p>This drawer has no close button. Use the footer actions to dismiss.</p>
        <div slot="footer">
          <ea-button (clicked)="isOpen = false">
            Dismiss
          </ea-button>
        </div>
      </ea-drawer>
    `,
  }),
};
