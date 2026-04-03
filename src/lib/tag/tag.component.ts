import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';

import { XIconComponent } from '../icons/x.component';

export type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type TagSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ea-tag',
  imports: [NgClass, XIconComponent],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TagComponent {
  readonly variant = input<TagVariant>('default');
  readonly size = input<TagSize>('md');
  readonly removable = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly removed = output<void>();

  readonly hostClasses = computed(() => ({
    [`ea-tag--${this.variant()}`]: true,
    [`ea-tag--${this.size()}`]: true,
    'ea-tag--disabled': this.disabled(),
  }));

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.removed.emit();
  }
}
