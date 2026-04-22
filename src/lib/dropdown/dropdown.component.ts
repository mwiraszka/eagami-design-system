import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ChevronDownIconComponent } from '../icons/chevron-down.component';

export type DropdownSize = 'sm' | 'md' | 'lg';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ea-dropdown',
  imports: [NgClass, ChevronDownIconComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  private readonly elRef = viewChild<ElementRef<HTMLElement>>('triggerEl');
  private readonly menuEl = viewChild<ElementRef<HTMLElement>>('menuEl');
  private readonly destroyRef = inject(DestroyRef);

  // Inputs
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string>('Select…');
  readonly options = input<DropdownOption[]>([]);
  readonly size = input<DropdownSize>('md');
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly hint = input<string | undefined>(undefined);
  readonly errorMsg = input<string | undefined>(undefined, { alias: 'error' });
  readonly id = input<string>(`ea-dropdown-${Math.random().toString(36).slice(2, 9)}`);

  // Two-way value binding
  readonly value = model<string>('');

  // Outputs
  readonly changed = output<string>();

  // Internal state
  readonly isOpen = signal(false);
  readonly focusedIndex = signal(-1);
  private readonly _formDisabled = signal(false);

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // Computed
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  readonly resolvedStatus = computed(() => (this.errorMsg() ? 'error' : 'default'));

  readonly showError = computed(() => !!this.errorMsg());
  readonly showHint = computed(() => !!this.hint() && !this.showError());

  readonly selectedLabel = computed(() => {
    const opt = this.options().find(o => o.value === this.value());
    return opt?.label ?? '';
  });

  readonly triggerClasses = computed(() => ({
    [`ea-dropdown__trigger--${this.size()}`]: true,
    [`ea-dropdown__trigger--${this.resolvedStatus()}`]: true,
    'ea-dropdown__trigger--open': this.isOpen(),
    'ea-dropdown__trigger--disabled': this.isDisabled(),
  }));

  constructor() {
    effect(() => {
      const menu = this.menuEl()?.nativeElement;
      const trigger = this.elRef()?.nativeElement;
      if (!menu || !trigger || !this.isOpen()) return;
      const rect = trigger.getBoundingClientRect();
      menu.style.top = `${rect.bottom + 4}px`;
      menu.style.left = `${rect.left}px`;
      menu.style.minWidth = `${rect.width}px`;
    });

    const closeOnViewportChange = (): void => {
      if (this.isOpen()) this.close();
    };
    window.addEventListener('scroll', closeOnViewportChange, {
      capture: true,
      passive: true,
    });
    window.addEventListener('resize', closeOnViewportChange);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', closeOnViewportChange, { capture: true });
      window.removeEventListener('resize', closeOnViewportChange);
    });
  }

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
  toggle(): void {
    if (this.isDisabled()) return;
    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) {
      const idx = this.options().findIndex(o => o.value === this.value());
      this.focusedIndex.set(idx >= 0 ? idx : 0);
    }
  }

  select(option: DropdownOption): void {
    if (option.disabled || this.isDisabled()) return;
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.changed.emit(option.value);
    this.close();
  }

  close(): void {
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.isOpen()) {
          const opts = this.options();
          const idx = this.focusedIndex();
          if (idx >= 0 && idx < opts.length && !opts[idx].disabled) {
            this.select(opts[idx]);
          }
        } else {
          this.toggle();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggle();
        } else {
          this.moveFocus(1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen()) {
          this.moveFocus(-1);
        }
        break;
      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.close();
          this.elRef()?.nativeElement.focus();
        }
        break;
    }
  }

  private moveFocus(delta: number): void {
    const opts = this.options();
    let idx = this.focusedIndex() + delta;
    while (idx >= 0 && idx < opts.length && opts[idx].disabled) {
      idx += delta;
    }
    if (idx >= 0 && idx < opts.length) {
      this.focusedIndex.set(idx);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isOpen()) return;
    const el = event.target as Node;
    const host = this.elRef()?.nativeElement.closest('ea-dropdown');
    if (host && !host.contains(el)) {
      this.close();
      this.onTouched();
    }
  }
}
