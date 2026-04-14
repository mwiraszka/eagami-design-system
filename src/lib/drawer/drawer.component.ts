import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  effect,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';

import { XIconComponent } from '../icons/x.component';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

@Component({
  selector: 'ea-drawer',
  imports: [NgClass, XIconComponent],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DrawerComponent {
  private readonly drawerEl = viewChild<ElementRef<HTMLDialogElement>>('drawerEl');

  // Inputs
  readonly position = input<DrawerPosition>('right');
  readonly size = input<DrawerSize>('md');
  readonly closeOnBackdrop = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);
  readonly showClose = input<boolean>(true);
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

  // Two-way open binding
  readonly open = model<boolean>(false);

  // Outputs
  readonly opened = output<void>();
  readonly closed = output<void>();

  // Computed
  readonly panelClasses = computed(() => ({
    [`ea-drawer__panel--${this.position()}`]: true,
    [`ea-drawer__panel--${this.size()}`]: true,
  }));

  constructor() {
    effect(() => {
      const drawerRef = this.drawerEl()?.nativeElement;
      if (!drawerRef) return;

      if (this.open()) {
        if (!drawerRef.open) {
          drawerRef.showModal();
          this.opened.emit();
        }
      } else {
        if (drawerRef.open) {
          drawerRef.close();
        }
      }
    });
  }

  handleClose(): void {
    this.open.set(false);
    this.closed.emit();
  }

  handleBackdropClick(event: MouseEvent): void {
    if (!this.closeOnBackdrop()) return;
    const drawerRef = this.drawerEl()?.nativeElement;
    if (event.target === drawerRef) {
      this.handleClose();
    }
  }

  handleCancel(event: Event): void {
    if (!this.closeOnEscape()) {
      event.preventDefault();
      return;
    }
    this.handleClose();
  }
}
