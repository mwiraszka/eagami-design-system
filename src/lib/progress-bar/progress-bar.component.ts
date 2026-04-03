import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';

export type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ea-progress-bar',
  imports: [NgClass],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProgressBarComponent {
  readonly value = input<number>(0);
  readonly max = input<number>(100);
  readonly variant = input<ProgressBarVariant>('default');
  readonly size = input<ProgressBarSize>('md');
  readonly label = input<string>('');
  readonly showValue = input<boolean>(false);
  readonly indeterminate = input<boolean>(false);

  readonly percentage = computed(() => {
    const max = this.max();
    if (max <= 0) return 0;
    return Math.min(100, Math.max(0, (this.value() / max) * 100));
  });

  readonly percentageRounded = computed(() => Math.round(this.percentage()));

  readonly hostClasses = computed(() => ({
    [`ea-progress-bar--${this.variant()}`]: true,
    [`ea-progress-bar--${this.size()}`]: true,
    'ea-progress-bar--indeterminate': this.indeterminate(),
  }));
}
