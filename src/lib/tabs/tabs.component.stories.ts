import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';

const meta: Meta<TabsComponent> = {
  title: 'Components/Tabs',
  component: TabsComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TabComponent] })],
  argTypes: {
    variant: {
      control: 'select',
      options: ['underline', 'filled'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    tabChange: { action: 'tabChange' },
  },
  args: {
    variant: 'underline',
    size: 'md',
    activeTab: 'account',
  },
};

export default meta;
type Story = StoryObj<TabsComponent>;

export const Underline: Story = {
  render: args => ({
    props: args,
    template: `
      <ea-tabs variant="${args['variant']}" size="${args['size']}" activeTab="${args['activeTab']}">
        <ea-tab value="account" label="Account">Account settings content</ea-tab>
        <ea-tab value="security" label="Security">Security settings content</ea-tab>
        <ea-tab value="notifications" label="Notifications">Notification preferences content</ea-tab>
      </ea-tabs>
    `,
  }),
};

export const Filled: Story = {
  render: () => ({
    template: `
      <ea-tabs variant="filled" activeTab="overview">
        <ea-tab value="overview" label="Overview">Overview content</ea-tab>
        <ea-tab value="analytics" label="Analytics">Analytics content</ea-tab>
        <ea-tab value="reports" label="Reports">Reports content</ea-tab>
      </ea-tabs>
    `,
  }),
};

export const WithDisabledTab: Story = {
  render: () => ({
    template: `
      <ea-tabs activeTab="general">
        <ea-tab value="general" label="General">General settings</ea-tab>
        <ea-tab value="billing" label="Billing">Billing details</ea-tab>
        <ea-tab value="admin" label="Admin" [disabled]="true">Admin panel</ea-tab>
      </ea-tabs>
    `,
  }),
};

export const Small: Story = {
  render: () => ({
    template: `
      <ea-tabs size="sm" activeTab="one">
        <ea-tab value="one" label="First">First tab</ea-tab>
        <ea-tab value="two" label="Second">Second tab</ea-tab>
        <ea-tab value="three" label="Third">Third tab</ea-tab>
      </ea-tabs>
    `,
  }),
};

export const Large: Story = {
  render: () => ({
    template: `
      <ea-tabs size="lg" activeTab="one">
        <ea-tab value="one" label="First">First tab</ea-tab>
        <ea-tab value="two" label="Second">Second tab</ea-tab>
        <ea-tab value="three" label="Third">Third tab</ea-tab>
      </ea-tabs>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <ea-tabs size="sm" activeTab="a">
          <ea-tab value="a" label="Small A">Small A content</ea-tab>
          <ea-tab value="b" label="Small B">Small B content</ea-tab>
        </ea-tabs>
        <ea-tabs size="md" activeTab="a">
          <ea-tab value="a" label="Medium A">Medium A content</ea-tab>
          <ea-tab value="b" label="Medium B">Medium B content</ea-tab>
        </ea-tabs>
        <ea-tabs size="lg" activeTab="a">
          <ea-tab value="a" label="Large A">Large A content</ea-tab>
          <ea-tab value="b" label="Large B">Large B content</ea-tab>
        </ea-tabs>
      </div>
    `,
  }),
};
