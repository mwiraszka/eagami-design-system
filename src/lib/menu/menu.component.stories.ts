import { Meta, StoryObj } from '@storybook/angular';

import { ButtonComponent } from '../button/button.component';
import { MoreHorizontalIconComponent } from '../icons/more-horizontal.component';
import { PencilIconComponent } from '../icons/pencil.component';
import { TrashIconComponent } from '../icons/trash.component';
import { MenuItemComponent } from './menu-item.component';
import { MenuComponent } from './menu.component';

const meta: Meta<MenuComponent> = {
  title: 'Components/Menu',
  component: MenuComponent,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    },
    opened: { action: 'opened' },
    closed: { action: 'closed' },
  },
  args: {
    placement: 'bottom-start',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<MenuComponent>;

export const Default: Story = {
  render: args => ({
    props: args,
    moduleMetadata: {
      imports: [MenuComponent, MenuItemComponent, ButtonComponent],
    },
    template: `
      <ea-menu [placement]="placement" [disabled]="disabled">
        <ea-button slot="trigger" variant="secondary">Actions</ea-button>
        <ea-menu-item>Edit</ea-menu-item>
        <ea-menu-item>Duplicate</ea-menu-item>
        <ea-menu-item>Archive</ea-menu-item>
        <ea-menu-item variant="danger">Delete</ea-menu-item>
      </ea-menu>
    `,
  }),
};

export const WithIcons: Story = {
  render: args => ({
    props: args,
    moduleMetadata: {
      imports: [
        MenuComponent,
        MenuItemComponent,
        ButtonComponent,
        PencilIconComponent,
        TrashIconComponent,
      ],
    },
    template: `
      <ea-menu [placement]="placement">
        <ea-button slot="trigger" variant="secondary">Actions</ea-button>
        <ea-menu-item>
          <ea-icon-pencil slot="icon" />
          Edit
        </ea-menu-item>
        <ea-menu-item variant="danger">
          <ea-icon-trash slot="icon" />
          Delete
        </ea-menu-item>
      </ea-menu>
    `,
  }),
};

export const IconTrigger: Story = {
  render: args => ({
    props: args,
    moduleMetadata: {
      imports: [
        MenuComponent,
        MenuItemComponent,
        ButtonComponent,
        MoreHorizontalIconComponent,
      ],
    },
    template: `
      <ea-menu [placement]="placement">
        <ea-button slot="trigger" variant="ghost" size="sm" aria-label="More options">
          <ea-icon-more-horizontal />
        </ea-button>
        <ea-menu-item>View</ea-menu-item>
        <ea-menu-item>Rename</ea-menu-item>
        <ea-menu-item variant="danger">Delete</ea-menu-item>
      </ea-menu>
    `,
  }),
};

export const WithDisabledItem: Story = {
  render: args => ({
    props: args,
    moduleMetadata: {
      imports: [MenuComponent, MenuItemComponent, ButtonComponent],
    },
    template: `
      <ea-menu [placement]="placement">
        <ea-button slot="trigger" variant="secondary">File</ea-button>
        <ea-menu-item>New</ea-menu-item>
        <ea-menu-item>Open</ea-menu-item>
        <ea-menu-item [disabled]="true">Save (unavailable)</ea-menu-item>
        <ea-menu-item>Save As</ea-menu-item>
      </ea-menu>
    `,
  }),
};

export const BottomEnd: Story = {
  args: { placement: 'bottom-end' },
  render: args => ({
    props: args,
    moduleMetadata: {
      imports: [MenuComponent, MenuItemComponent, ButtonComponent],
    },
    template: `
      <ea-menu [placement]="placement">
        <ea-button slot="trigger" variant="secondary">Actions</ea-button>
        <ea-menu-item>Edit</ea-menu-item>
        <ea-menu-item>Share</ea-menu-item>
        <ea-menu-item variant="danger">Delete</ea-menu-item>
      </ea-menu>
    `,
  }),
};
