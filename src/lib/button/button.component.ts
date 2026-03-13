import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'ea-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ea-button--full-width]': 'fullWidth()',
  },
})
export class ButtonComponent {
  // Inputs
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<ButtonType>('button');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

  // Output
  readonly clicked = output<MouseEvent>();

  // Derived
  readonly isDisabled = computed(() => this.disabled() || this.loading());

  readonly hostClasses = computed(() => ({
    [`ea-button--${this.variant()}`]: true,
    [`ea-button--${this.size()}`]: true,
    'ea-button--full-width': this.fullWidth(),
    'ea-button--loading': this.loading(),
    'ea-button--disabled': this.isDisabled(),
  }));

  handleClick(event: MouseEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      return;
    }
    this.clicked.emit(event);
  }
}
