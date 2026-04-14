import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';

export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

@Component({
  selector: 'ea-menu',
  imports: [NgClass],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  private readonly elRef = inject(ElementRef<HTMLElement>);

  // Inputs
  readonly placement = input<MenuPlacement>('bottom-start');
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>('Menu', { alias: 'aria-label' });

  // Two-way open binding
  readonly open = model<boolean>(false);

  // Outputs
  readonly opened = output<void>();
  readonly closed = output<void>();

  // Computed
  readonly menuId = signal(`ea-menu-${Math.random().toString(36).slice(2, 9)}`);

  readonly menuClasses = computed(() => ({
    [`ea-menu__list--${this.placement()}`]: true,
  }));

  toggle(): void {
    if (this.disabled()) return;
    const next = !this.open();
    this.open.set(next);
    if (next) {
      this.opened.emit();
    } else {
      this.closed.emit();
    }
  }

  close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.closed.emit();
  }

  handleTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.open()) this.toggle();
    } else if (event.key === 'Escape' && this.open()) {
      event.preventDefault();
      this.close();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.open()) return;
    const target = event.target as Node;
    if (!this.elRef.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.close();
  }
}
