import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'ea-accordion',
  template: ` <div class="ea-accordion"><ng-content /></div> `,
  styleUrl: './accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
  readonly multi = input<boolean>(false);

  readonly expandedItems = signal<Set<string>>(new Set());

  toggle(value: string): void {
    const current = this.expandedItems();
    const next = new Set(current);

    if (next.has(value)) {
      next.delete(value);
    } else {
      if (!this.multi()) {
        next.clear();
      }
      next.add(value);
    }

    this.expandedItems.set(next);
  }

  isExpanded(value: string): boolean {
    return this.expandedItems().has(value);
  }
}
