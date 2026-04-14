import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';

import { AvatarEditorComponent } from './avatar-editor.component';

const meta: Meta<AvatarEditorComponent> = {
  title: 'Components/Avatar editor',
  component: AvatarEditorComponent,
  tags: ['autodocs'],
  render: args => ({
    props: args,
    template: `<ea-avatar-editor ${argsToTemplate(args)}></ea-avatar-editor>`,
  }),
  argTypes: {
    shape: {
      control: 'select',
      options: ['circle', 'square'],
    },
    canvasSize: { control: { type: 'range', min: 100, max: 400, step: 50 } },
    maxFileSize: { control: 'number' },
    minZoom: { control: 'number' },
    maxZoom: { control: 'number' },
    cropped: { action: 'cropped' },
    removed: { action: 'removed' },
    fileSelected: { action: 'fileSelected' },
    fileError: { action: 'fileError' },
    cropStateChange: { action: 'cropStateChange' },
  },
  args: {
    shape: 'circle',
    canvasSize: 200,
    minZoom: 1,
    maxZoom: 3,
  },
};

export default meta;
type Story = StoryObj<AvatarEditorComponent>;

export const Default: Story = {};

export const Square: Story = {
  args: { shape: 'square' },
};

export const LargeCanvas: Story = {
  args: { canvasSize: 300 },
};

export const WithExistingImage: Story = {
  args: { currentSrc: 'assets/sample-avatar.jpg' },
};

export const SquareWithExistingImage: Story = {
  args: { shape: 'square', currentSrc: 'assets/sample-avatar.jpg' },
};

export const WithCropState: Story = {
  args: {
    currentSrc: 'assets/sample-avatar.jpg',
    cropState: { zoom: 1.4, offsetX: -30, offsetY: -20 },
  },
};

export const SquareWithCropState: Story = {
  args: {
    shape: 'square',
    currentSrc: 'assets/sample-avatar.jpg',
    cropState: { zoom: 1.4, offsetX: -30, offsetY: -20 },
  },
};

export const BothShapes: Story = {
  render: () => ({
    template: `
      <div class="story-shapes-row">
        <div class="story-shape-item">
          <span class="story-shape-label">Circle</span>
          <ea-avatar-editor shape="circle" [canvasSize]="180" currentSrc="assets/sample-avatar.jpg"></ea-avatar-editor>
        </div>
        <div class="story-shape-item">
          <span class="story-shape-label">Square</span>
          <ea-avatar-editor shape="square" [canvasSize]="180" currentSrc="assets/sample-avatar.jpg"></ea-avatar-editor>
        </div>
      </div>
    `,
  }),
};
