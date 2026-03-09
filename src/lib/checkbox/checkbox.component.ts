import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type CheckboxSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ea-checkbox',
  imports: [NgClass],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  // Inputs
  readonly label = input<string | undefined>(undefined);
  readonly size = input<CheckboxSize>('md');
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly indeterminate = input<boolean>(false);
  readonly id = input<string>(`ea-checkbox-${Math.random().toString(36).slice(2, 9)}`);

  // Two-way checked binding
  readonly checked = model<boolean>(false);

  // Outputs
  readonly changed = output<boolean>();

  // Internal state
  private readonly _formDisabled = signal(false);

  // Computed
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  readonly hostClasses = computed(() => ({
    [`ea-checkbox--${this.size()}`]: true,
    'ea-checkbox--disabled': this.isDisabled(),
    'ea-checkbox--checked': this.checked(),
    'ea-checkbox--indeterminate': this.indeterminate(),
  }));

  // ControlValueAccessor callbacks
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  // ControlValueAccessor
  writeValue(val: boolean): void {
    this.checked.set(!!val);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }

  // Handlers
  handleChange(): void {
    if (this.isDisabled()) return;
    const newValue = !this.checked();
    this.checked.set(newValue);
    this.onChange(newValue);
    this.onTouched();
    this.changed.emit(newValue);
  }
}
