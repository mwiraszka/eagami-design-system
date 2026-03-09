import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { RadioGroupComponent } from './radio-group.component';

@Component({
  selector: 'ea-radio',
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class RadioComponent {
  private readonly group = inject(RadioGroupComponent);

  // Inputs
  readonly value = input.required<string>();
  readonly label = input<string | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly id = input<string>(`ea-radio-opt-${Math.random().toString(36).slice(2, 9)}`);

  // Computed
  readonly isChecked = computed(() => this.group.value() === this.value());
  readonly isDisabled = computed(() => this.disabled() || this.group.isDisabled());
  readonly name = computed(() => this.group.name());
  readonly size = computed(() => this.group.size());

  readonly hostClasses = computed(() => ({
    [`ea-radio--${this.size()}`]: true,
    'ea-radio--disabled': this.isDisabled(),
    'ea-radio--checked': this.isChecked(),
  }));

  handleChange(): void {
    if (this.isDisabled()) return;
    this.group.select(this.value());
  }
}
