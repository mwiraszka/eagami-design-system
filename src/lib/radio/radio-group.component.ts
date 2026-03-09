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

export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioOrientation = 'vertical' | 'horizontal';

@Component({
  selector: 'ea-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
})
export class RadioGroupComponent implements ControlValueAccessor {
  // Inputs
  readonly name = input<string>(`ea-radio-${Math.random().toString(36).slice(2, 9)}`);
  readonly size = input<RadioSize>('md');
  readonly orientation = input<RadioOrientation>('vertical');
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

  // Two-way value binding
  readonly value = model<string>('');

  // Output
  readonly changed = output<string>();

  // Internal state
  private readonly _formDisabled = signal(false);

  // Computed
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // ControlValueAccessor
  writeValue(val: string): void {
    this.value.set(val ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }

  select(val: string): void {
    if (this.isDisabled()) return;
    this.value.set(val);
    this.onChange(val);
    this.onTouched();
    this.changed.emit(val);
  }
}
