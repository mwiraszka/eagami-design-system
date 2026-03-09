import {
  ButtonComponent,
  CardComponent,
  CheckboxComponent,
  DialogComponent,
  DropdownComponent,
  DropdownOption,
  InputComponent,
  RadioComponent,
  RadioGroupComponent,
} from '@eagami/ui';

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'sandbox-root',
  imports: [
    ButtonComponent,
    CardComponent,
    CheckboxComponent,
    DialogComponent,
    DropdownComponent,
    InputComponent,
    RadioComponent,
    RadioGroupComponent,
  ],
  templateUrl: './sandbox.component.html',
  styleUrl: './sandbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxComponent {
  isLoading = signal(false);
  inputValue = signal('');
  checkboxValue = signal(false);
  radioValue = signal('');
  dropdownValue = signal('');
  dialogOpen = signal(false);

  dropdownOptions: DropdownOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
  ];
}
