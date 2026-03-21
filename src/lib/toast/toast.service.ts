import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
}

export interface ToastOptions {
  variant?: ToastVariant;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;

  readonly toasts = signal<Toast[]>([]);

  show(message: string, options: ToastOptions = {}): number {
    const id = this.nextId++;
    const toast: Toast = {
      id,
      message,
      variant: options.variant ?? 'default',
      duration: options.duration ?? 4000,
    };

    this.toasts.update(list => [...list, toast]);

    if (toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }

    return id;
  }

  success(message: string, duration?: number): number {
    return this.show(message, { variant: 'success', duration });
  }

  error(message: string, duration?: number): number {
    return this.show(message, { variant: 'error', duration });
  }

  warning(message: string, duration?: number): number {
    return this.show(message, { variant: 'warning', duration });
  }

  info(message: string, duration?: number): number {
    return this.show(message, { variant: 'info', duration });
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
