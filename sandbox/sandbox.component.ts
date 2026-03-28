import {
  AccordionComponent,
  AccordionItemComponent,
  AlertComponent,
  AvatarComponent,
  AvatarEditorComponent,
  AvatarEditorCropEvent,
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  CheckboxComponent,
  CodeInputComponent,
  DialogComponent,
  DividerComponent,
  DropdownComponent,
  DropdownOption,
  InputComponent,
  RadioComponent,
  RadioGroupComponent,
  SkeletonComponent,
  SpinnerComponent,
  SwitchComponent,
  TabComponent,
  TabsComponent,
  TextareaComponent,
  ToastComponent,
  ToastService,
  TooltipDirective,
} from '@eagami/ui';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

@Component({
  selector: 'sandbox-root',
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    AlertComponent,
    AvatarEditorComponent,
    AvatarComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    CheckboxComponent,
    CodeInputComponent,
    DialogComponent,
    DividerComponent,
    DropdownComponent,
    InputComponent,
    RadioComponent,
    RadioGroupComponent,
    SkeletonComponent,
    SpinnerComponent,
    SwitchComponent,
    TabComponent,
    TabsComponent,
    TextareaComponent,
    ToastComponent,
    TooltipDirective,
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
  dialogOpen = signal(false);
  switchValue = signal(false);
  textareaValue = signal('');
  croppedAvatarUrl = signal('');

  dropdownOptions: DropdownOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
  ];

  showToast(variant: 'default' | 'success' | 'warning' | 'error' | 'info'): void {
    this.toastService.show(`This is a ${variant} toast`, { variant });
  }

  onAvatarCropped(event: AvatarEditorCropEvent): void {
    this.croppedAvatarUrl.set(event.dataUrl);
    this.toastService.success('Avatar updated');
  }
}
