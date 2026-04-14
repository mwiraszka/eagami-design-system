import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type AutocompleteSize = 'sm' | 'md' | 'lg';

export interface AutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ea-autocomplete',
  imports: [NgClass],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent implements ControlValueAccessor {
  private readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');
  private readonly hostEl = viewChild<ElementRef<HTMLElement>>('hostEl');

  // Inputs
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string>('');
  readonly options = input<AutocompleteOption[]>([]);
  readonly size = input<AutocompleteSize>('md');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly hint = input<string | undefined>(undefined);
  readonly errorMsg = input<string | undefined>(undefined, { alias: 'error' });
  readonly minLength = input<number>(0);
  readonly maxResults = input<number>(10);
  readonly emptyMessage = input<string>('No results');
  readonly id = input<string>(
    `ea-autocomplete-${Math.random().toString(36).slice(2, 9)}`,
  );

  // Two-way value binding (current text value in the input)
  readonly value = model<string>('');

  // Outputs
  readonly optionSelected = output<AutocompleteOption>();
  readonly valueChanged = output<string>();

  // Internal state
  readonly isOpen = signal(false);
  readonly focused = signal(false);
  readonly focusedIndex = signal(-1);
  private readonly _formDisabled = signal(false);
  private justSelected = false;

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // Computed
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  readonly resolvedStatus = computed(() => (this.errorMsg() ? 'error' : 'default'));

  readonly showError = computed(() => !!this.errorMsg());
  readonly showHint = computed(() => !!this.hint() && !this.showError());

  readonly filteredOptions = computed<AutocompleteOption[]>(() => {
    const query = this.value().trim().toLowerCase();
    const allOptions = this.options();
    const max = this.maxResults();

    if (query.length < this.minLength()) return [];

    const matched = query
      ? allOptions.filter(o => o.label.toLowerCase().includes(query))
      : allOptions;

    return matched.slice(0, max);
  });

  readonly showList = computed(
    () => this.isOpen() && this.value().length >= this.minLength(),
  );

  readonly showEmpty = computed(
    () => this.showList() && this.filteredOptions().length === 0,
  );

  readonly wrapperClasses = computed(() => ({
    [`ea-autocomplete__wrapper--${this.size()}`]: true,
    [`ea-autocomplete__wrapper--${this.resolvedStatus()}`]: true,
    'ea-autocomplete__wrapper--focused': this.focused(),
    'ea-autocomplete__wrapper--disabled': this.isDisabled(),
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
    const next = (event.target as HTMLInputElement).value;
    this.value.set(next);
    this.onChange(next);
    this.valueChanged.emit(next);
    this.isOpen.set(true);
    this.focusedIndex.set(-1);
  }

  handleFocus(): void {
    this.focused.set(true);
    if (this.justSelected) {
      this.justSelected = false;
      return;
    }
    if (this.value().length >= this.minLength()) {
      this.isOpen.set(true);
    }
  }

  handleBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  handleKeydown(event: KeyboardEvent): void {
    if (this.isDisabled() || this.readonly()) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        } else {
          this.moveFocus(1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen()) this.moveFocus(-1);
        break;
      case 'Enter': {
        const opts = this.filteredOptions();
        const idx = this.focusedIndex();
        if (this.isOpen() && idx >= 0 && idx < opts.length && !opts[idx].disabled) {
          event.preventDefault();
          this.selectOption(opts[idx]);
        }
        break;
      }
      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.close();
        }
        break;
    }
  }

  selectOption(option: AutocompleteOption): void {
    if (option.disabled || this.isDisabled()) return;
    this.value.set(option.label);
    this.onChange(option.label);
    this.valueChanged.emit(option.label);
    this.optionSelected.emit(option);
    this.justSelected = true;
    this.close();
    this.inputEl()?.nativeElement.focus();
  }

  close(): void {
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
  }

  private moveFocus(delta: number): void {
    const opts = this.filteredOptions();
    if (opts.length === 0) return;
    let idx = this.focusedIndex() + delta;
    while (idx >= 0 && idx < opts.length && opts[idx].disabled) {
      idx += delta;
    }
    if (idx < 0 || idx >= opts.length) return;
    this.focusedIndex.set(idx);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isOpen()) return;
    const host = this.hostEl()?.nativeElement;
    if (host && !host.contains(event.target as Node)) {
      this.close();
    }
  }
}
