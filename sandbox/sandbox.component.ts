import {
  AccordionComponent,
  AccordionItemComponent,
  AlertComponent,
  AutocompleteComponent,
  AutocompleteOption,
  AvatarComponent,
  AvatarEditorComponent,
  AvatarEditorCropEvent,
  BadgeComponent,
  BreadcrumbItem,
  BreadcrumbsComponent,
  ButtonComponent,
  CardComponent,
  CheckboxComponent,
  CodeInputComponent,
  DataTableColumn,
  DataTableComponent,
  DatePickerComponent,
  DialogComponent,
  DividerComponent,
  DrawerComponent,
  DropdownComponent,
  DropdownOption,
  EagamiWordmarkComponent,
  InputComponent,
  MenuComponent,
  MenuItemComponent,
  MoreHorizontalIconComponent,
  PaginatorComponent,
  PaginatorState,
  PencilIconComponent,
  ProgressBarComponent,
  RadioComponent,
  RadioGroupComponent,
  SkeletonComponent,
  SpinnerComponent,
  SwitchComponent,
  TabComponent,
  TabsComponent,
  TagComponent,
  TextareaComponent,
  ToastComponent,
  ToastService,
  TooltipDirective,
  TrashIconComponent,
} from '@eagami/ui';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

@Component({
  selector: 'sandbox-root',
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    AlertComponent,
    AutocompleteComponent,
    AvatarEditorComponent,
    AvatarComponent,
    BadgeComponent,
    BreadcrumbsComponent,
    ButtonComponent,
    CardComponent,
    CheckboxComponent,
    CodeInputComponent,
    DataTableComponent,
    DatePickerComponent,
    DialogComponent,
    DividerComponent,
    DrawerComponent,
    DropdownComponent,
    EagamiWordmarkComponent,
    InputComponent,
    MenuComponent,
    MenuItemComponent,
    MoreHorizontalIconComponent,
    PaginatorComponent,
    PencilIconComponent,
    ProgressBarComponent,
    RadioComponent,
    RadioGroupComponent,
    SkeletonComponent,
    SpinnerComponent,
    SwitchComponent,
    TabComponent,
    TabsComponent,
    TagComponent,
    TextareaComponent,
    ToastComponent,
    TooltipDirective,
    TrashIconComponent,
  ],
  templateUrl: './sandbox.component.html',
  styleUrl: './sandbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxComponent {
  private readonly toastService = inject(ToastService);

  isLoading = signal(false);
  codeInputValue = signal('');
  inputValue = signal('');
  checkboxValue = signal(false);
  radioValue = signal('');
  dropdownValue = signal('');
  datePickerValue = signal<Date | null>(null);
  datePickerMin = new Date(new Date().setDate(new Date().getDate() - 7));
  datePickerMax = new Date(new Date().setDate(new Date().getDate() + 21));
  dialogOpen = signal(false);
  drawerOpenRight = signal(false);
  drawerOpenLeft = signal(false);
  drawerOpenTop = signal(false);
  drawerOpenBottom = signal(false);
  autocompleteValue = signal('');
  switchValue = signal(false);
  textareaValue = signal('');
  croppedAvatarUrl = signal('');
  tablePage = signal(1);
  tablePageSize = signal(5);

  autocompleteOptions: AutocompleteOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'solid', label: 'Solid' },
    { value: 'qwik', label: 'Qwik' },
    { value: 'preact', label: 'Preact' },
    { value: 'lit', label: 'Lit' },
  ];

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Laptops', href: '/products/laptops' },
    { label: 'MacBook Pro' },
  ];

  breadcrumbItemsShort: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/' },
    { label: 'Settings' },
  ];

  dropdownOptions: DropdownOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
  ];

  tableColumns: DataTableColumn[] = [
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

  tableData = [
    { id: 1, firstName: 'Alice', lastName: 'Johnson', admin: '', posts: 847 },
    { id: 2, firstName: 'René', lastName: 'Dupont', admin: '✓', posts: 12 },
    { id: 3, firstName: 'Charlie', lastName: 'García', admin: '', posts: 503 },
    { id: 4, firstName: 'Diana', lastName: 'Müller', admin: '', posts: 1291 },
    { id: 5, firstName: 'Zoë', lastName: 'Davis', admin: '', posts: 68 },
    { id: 6, firstName: 'Frank', lastName: 'Østergaard', admin: '✓', posts: 245 },
    { id: 7, firstName: 'Chloé', lastName: 'Lefèvre', admin: '', posts: 1034 },
    { id: 8, firstName: 'Søren', lastName: 'Berg', admin: '', posts: 4 },
    { id: 9, firstName: 'Ivy', lastName: 'Chen', admin: '', posts: 392 },
    { id: 10, firstName: 'André', lastName: 'Turner', admin: '✓', posts: 1150 },
    { id: 11, firstName: 'Karen', lastName: 'Hernández', admin: '', posts: 76 },
    { id: 12, firstName: 'Léo', lastName: 'Martinez', admin: '', posts: 619 },
  ];

  get pagedTableData() {
    const start = (this.tablePage() - 1) * this.tablePageSize();
    return this.tableData.slice(start, start + this.tablePageSize());
  }

  onTablePageChange(event: PaginatorState): void {
    this.tablePage.set(event.page);
    this.tablePageSize.set(event.pageSize);
  }

  showToast(variant: 'default' | 'success' | 'warning' | 'error' | 'info'): void {
    const article = variant === 'error' || variant === 'info' ? 'an' : 'a';
    this.toastService.show(`This is ${article} ${variant} toast`, { variant });
  }

  triggerLoading(): void {
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 3000);
  }

  onAvatarCropped(event: AvatarEditorCropEvent): void {
    this.croppedAvatarUrl.set(event.dataUrl);
    this.toastService.success('Avatar updated');
  }
}
