import { Meta, StoryObj } from '@storybook/angular';

import { PaginatorComponent } from '../paginator/paginator.component';
import { DataTableColumn, DataTableComponent } from './data-table.component';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  admin: string;
  posts: number;
}

const sampleData: User[] = [
  { id: 1, firstName: 'Alice', lastName: 'Johnson', admin: '', posts: 847 },
  { id: 2, firstName: 'René', lastName: 'Dupont', admin: '✓', posts: 12 },
  { id: 3, firstName: 'Charlie', lastName: 'García', admin: '', posts: 503 },
  { id: 4, firstName: 'Diana', lastName: 'Müller', admin: '', posts: 1291 },
  { id: 5, firstName: 'Zoë', lastName: 'Davis', admin: '', posts: 68 },
  { id: 6, firstName: 'Frank', lastName: 'Østergaard', admin: '✓', posts: 245 },
  { id: 7, firstName: 'Chloé', lastName: 'Lefèvre', admin: '', posts: 1034 },
  { id: 8, firstName: 'Søren', lastName: 'Berg', admin: '', posts: 4 },
];

const columns: DataTableColumn<User>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '60px', align: 'center' },
  { key: 'firstName', label: 'First Name', sortable: true },
  { key: 'lastName', label: 'Last Name', sortable: true },
  { key: 'admin', label: 'Admin', sortable: true, align: 'center' },
  {
    key: 'posts',
    label: 'Posts',
    sortable: true,
    align: 'right',
    format: v => (v as number).toLocaleString('en-US'),
  },
];

const meta: Meta<DataTableComponent<User>> = {
  title: 'Components/Data table',
  component: DataTableComponent,
  tags: ['autodocs'],
  argTypes: {
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
    },
    sortChange: { action: 'sortChange' },
  },
  args: {
    columns,
    data: sampleData,
    density: 'comfortable',
    stickyHeader: false,
    striped: false,
    hoverable: true,
    bordered: false,
    noDataText: 'No data available',
  },
};

export default meta;
type Story = StoryObj<DataTableComponent<User>>;

export const Default: Story = {};

export const Compact: Story = {
  args: { density: 'compact' },
};

export const Spacious: Story = {
  args: { density: 'spacious' },
};

export const Striped: Story = {
  args: { striped: true },
};

export const Bordered: Story = {
  args: { bordered: true },
};

export const StripedAndBordered: Story = {
  args: { striped: true, bordered: true },
};

export const StickyHeader: Story = {
  args: { stickyHeader: true },
  render: args => ({
    props: args,
    template: `
      <ea-data-table
        class="story-sticky-table"
        [columns]="columns"
        [data]="data"
        [stickyHeader]="true"
        [density]="density"
        [striped]="striped"
        [hoverable]="hoverable" />
    `,
  }),
};

export const EmptyState: Story = {
  args: { data: [] },
};

export const WithPaginator: Story = {
  render: () => ({
    moduleMetadata: { imports: [DataTableComponent, PaginatorComponent] },
    props: {
      columns,
      allData: sampleData,
      page: 1,
      pageSize: 3,
      get data() {
        const start = (this['page'] - 1) * this['pageSize'];
        return this['allData'].slice(start, start + this['pageSize']);
      },
      onPageChange(event: { page: number; pageSize: number }) {
        this['page'] = event.page;
        this['pageSize'] = event.pageSize;
      },
    },
    template: `
      <ea-data-table [columns]="columns" [data]="data" [striped]="true">
        <ea-paginator
          [totalItems]="allData.length"
          [(page)]="page"
          [(pageSize)]="pageSize"
          [pageSizeOptions]="[3, 5, 8]"
          (changed)="onPageChange($event)" />
      </ea-data-table>
    `,
  }),
};

export const AllDensities: Story = {
  render: () => ({
    props: { columns, data: sampleData.slice(0, 3) },
    template: `
      <div class="story-stack--xl">
        <div>
          <h4 class="story-label">Compact</h4>
          <ea-data-table [columns]="columns" [data]="data" density="compact" />
        </div>
        <div>
          <h4 class="story-label">Comfortable</h4>
          <ea-data-table [columns]="columns" [data]="data" density="comfortable" />
        </div>
        <div>
          <h4 class="story-label">Spacious</h4>
          <ea-data-table [columns]="columns" [data]="data" density="spacious" />
        </div>
      </div>
    `,
  }),
};
