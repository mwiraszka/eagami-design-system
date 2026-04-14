import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';

import { ChevronRightIconComponent } from '../icons/chevron-right.component';

export type BreadcrumbsSeparator = 'chevron' | 'slash';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  disabled?: boolean;
}

export interface BreadcrumbClickEvent {
  item: BreadcrumbItem;
  index: number;
  event: MouseEvent;
}

@Component({
  selector: 'ea-breadcrumbs',
  imports: [ChevronRightIconComponent],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbsComponent {
  readonly items = input<BreadcrumbItem[]>([]);
  readonly separator = input<BreadcrumbsSeparator>('chevron');
  readonly ariaLabel = input<string>('Breadcrumb', { alias: 'aria-label' });

  readonly itemClicked = output<BreadcrumbClickEvent>();

  isLast(index: number): boolean {
    return index === this.items().length - 1;
  }

  handleClick(item: BreadcrumbItem, index: number, event: MouseEvent): void {
    if (item.disabled || this.isLast(index)) {
      event.preventDefault();
      return;
    }
    this.itemClicked.emit({ item, index, event });
  }
}
