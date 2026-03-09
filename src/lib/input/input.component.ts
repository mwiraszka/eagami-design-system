import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputStatus = 'default' | 'error' | 'success';
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'search'
  | 'tel'
  | 'url';

@Component({
  selector: 'ea-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  // Inputs
  readonly label = input<string | undefined>(undefined);
  readonly type = input<InputType>('text');
  readonly placeholder = input<string>('');
  readonly size = input<InputSize>('md');
  readonly status = input<InputStatus>('default');
  readonly hint = input<string | undefined>(undefined);
  readonly errorMsg = input<string | undefined>(undefined, { alias: 'error' });
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly id = input<string>(`ea-input-${Math.random().toString(36).slice(2, 9)}`);

  // Two-way value binding
  readonly value = model<string>('');

  // Internal state
  readonly focused = signal(false);
  private readonly _formDisabled = signal(false);

  // Outputs
  readonly inputFocused = output<FocusEvent>();
  readonly inputBlurred = output<FocusEvent>();

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // Computed
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  readonly resolvedStatus = computed<InputStatus>(() =>
    this.errorMsg() ? 'error' : this.status(),
  );

  readonly showError = computed(() => !!this.errorMsg());
  readonly showHint = computed(() => !!this.hint() && !this.showError());

  readonly wrapperClasses = computed(() => ({
    [`ea-input-wrapper--${this.size()}`]: true,
    [`ea-input-wrapper--${this.resolvedStatus()}`]: true,
    'ea-input-wrapper--focused': this.focused(),
    'ea-input-wrapper--disabled': this.isDisabled(),
    'ea-input-wrapper--readonly': this.readonly(),
  }));

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

  // Handlers
  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  handleFocus(event: FocusEvent): void {
    this.focused.set(true);
    this.inputFocused.emit(event);
  }

  handleBlur(event: FocusEvent): void {
    this.focused.set(false);
    this.onTouched();
    this.inputBlurred.emit(event);
  }

  focus(): void {
    this.inputEl()?.nativeElement.focus();
  }
}
