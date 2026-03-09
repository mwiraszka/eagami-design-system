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

export type DialogSize = 'sm' | 'md' | 'lg' | 'full';

@Component({
  selector: 'ea-dialog',
  imports: [NgClass],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DialogComponent {
  private readonly dialogEl = viewChild<ElementRef<HTMLDialogElement>>('dialogEl');

  // Inputs
  readonly size = input<DialogSize>('md');
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
    [`ea-dialog__panel--${this.size()}`]: true,
  }));

  constructor() {
    effect(() => {
      const dialogRef = this.dialogEl()?.nativeElement;
      if (!dialogRef) return;

      if (this.open()) {
        if (!dialogRef.open) {
          dialogRef.showModal();
          this.opened.emit();
        }
      } else {
        if (dialogRef.open) {
          dialogRef.close();
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
    const dialogRef = this.dialogEl()?.nativeElement;
    if (event.target === dialogRef) {
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
