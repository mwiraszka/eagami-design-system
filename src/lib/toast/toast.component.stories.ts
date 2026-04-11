import { Meta, StoryObj } from '@storybook/angular';

import { ButtonComponent } from '../button/button.component';
import { ToastComponent } from './toast.component';
import { ToastService } from './toast.service';

const toastService = new ToastService();

const meta: Meta<ToastComponent> = {
  title: 'Components/Toast',
  component: ToastComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ToastComponent>;

export const Default: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [ButtonComponent],
      providers: [{ provide: ToastService, useValue: toastService }],
    },
    template: `
      <ea-toast />
      <div class="story-row">
        <ea-button variant="secondary" (clicked)="showDefault()">Default</ea-button>
        <ea-button variant="secondary" (clicked)="showSuccess()">Success</ea-button>
        <ea-button variant="secondary" (clicked)="showWarning()">Warning</ea-button>
        <ea-button variant="secondary" (clicked)="showError()">Error</ea-button>
        <ea-button variant="secondary" (clicked)="showInfo()">Info</ea-button>
      </div>
    `,
    props: {
      showDefault: () => toastService.show('This is a default toast'),
      showSuccess: () => toastService.success('Operation completed successfully'),
      showWarning: () => toastService.warning('Please review your input'),
      showError: () => toastService.error('Something went wrong'),
      showInfo: () => toastService.info('Here is some useful information'),
    },
  }),
};
