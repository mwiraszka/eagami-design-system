import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { AccordionComponent } from './accordion.component';

@Component({
  selector: 'ea-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionItemComponent {
  private readonly accordion = inject(AccordionComponent);

  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly disabled = input<boolean>(false);

  readonly isExpanded = computed(() => this.accordion.isExpanded(this.value()));

  toggle(): void {
    if (this.disabled()) return;
    this.accordion.toggle(this.value());
  }
}
