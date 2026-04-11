import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { AccordionItemComponent } from './accordion-item.component';
import { AccordionComponent } from './accordion.component';

const meta: Meta<AccordionComponent> = {
  title: 'Components/Accordion',
  component: AccordionComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [AccordionItemComponent] })],
  argTypes: {
    multi: { control: 'boolean' },
  },
  args: {
    multi: false,
  },
};

export default meta;
type Story = StoryObj<AccordionComponent>;

export const Default: Story = {
  render: args => ({
    props: args,
    template: `
      <ea-accordion [multi]="multi" class="story-medium">
        <ea-accordion-item value="what" label="What is @eagami/ui?">
          A lightweight, accessible Angular component library built on CSS custom properties.
        </ea-accordion-item>
        <ea-accordion-item value="install" label="How do I install it?">
          Run npm install @eagami/ui or pnpm add @eagami/ui, then add the global stylesheet.
        </ea-accordion-item>
        <ea-accordion-item value="theme" label="Can I customize the theme?">
          Yes — override any CSS custom property on :root or scope overrides to individual components.
        </ea-accordion-item>
      </ea-accordion>
    `,
  }),
};

export const MultiExpand: Story = {
  args: { multi: true },
  render: args => ({
    props: args,
    template: `
      <ea-accordion [multi]="multi" class="story-medium">
        <ea-accordion-item value="one" label="Section One">
          Content for section one. Multiple sections can be open at once.
        </ea-accordion-item>
        <ea-accordion-item value="two" label="Section Two">
          Content for section two.
        </ea-accordion-item>
        <ea-accordion-item value="three" label="Section Three">
          Content for section three.
        </ea-accordion-item>
      </ea-accordion>
    `,
  }),
};

export const WithDisabledItem: Story = {
  render: () => ({
    template: `
      <ea-accordion class="story-medium">
        <ea-accordion-item value="active" label="Active Section">
          This section can be toggled.
        </ea-accordion-item>
        <ea-accordion-item value="disabled" label="Disabled Section" [disabled]="true">
          This content is not reachable.
        </ea-accordion-item>
        <ea-accordion-item value="another" label="Another Section">
          This section also works.
        </ea-accordion-item>
      </ea-accordion>
    `,
  }),
};
