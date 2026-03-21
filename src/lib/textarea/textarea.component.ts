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

import { AlertCircleIconComponent } from '../icons/alert-circle.component';

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaStatus = 'default' | 'error' | 'success';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

@Component({
  selector: 'ea-textarea',
  imports: [NgClass, AlertCircleIconComponent],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  readonly textareaEl = viewChild<ElementRef<HTMLTextAreaElement>>('textareaEl');

  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string>('');
  readonly size = input<TextareaSize>('md');
  readonly status = input<TextareaStatus>('default');
  readonly hint = input<string | undefined>(undefined);
  readonly errorMsg = input<string | undefined>(undefined, { alias: 'error' });
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly rows = input<number>(3);
  readonly resize = input<TextareaResize>('vertical');
  readonly maxlength = input<number | undefined>(undefined);
  readonly id = input<string>(`ea-textarea-${Math.random().toString(36).slice(2, 9)}`);

  readonly value = model<string>('');

  readonly focused = signal(false);
  private readonly _formDisabled = signal(false);

  readonly textareaFocused = output<FocusEvent>();
  readonly textareaBlurred = output<FocusEvent>();

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());
  readonly resolvedStatus = computed<TextareaStatus>(() =>
    this.errorMsg() ? 'error' : this.status(),
  );
  readonly showError = computed(() => !!this.errorMsg());
  readonly showHint = computed(() => !!this.hint() && !this.showError());

  readonly wrapperClasses = computed(() => ({
    [`ea-textarea-wrapper--${this.size()}`]: true,
    [`ea-textarea-wrapper--${this.resolvedStatus()}`]: true,
    'ea-textarea-wrapper--focused': this.focused(),
    'ea-textarea-wrapper--disabled': this.isDisabled(),
    'ea-textarea-wrapper--readonly': this.readonly(),
  }));

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

  handleInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  handleFocus(event: FocusEvent): void {
    this.focused.set(true);
    this.textareaFocused.emit(event);
  }

  handleBlur(event: FocusEvent): void {
    this.focused.set(false);
    this.onTouched();
    this.textareaBlurred.emit(event);
  }

  focus(): void {
    this.textareaEl()?.nativeElement.focus();
  }
}
