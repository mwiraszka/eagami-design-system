import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';

export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardHeaderAlign = 'start' | 'center' | 'end';

@Component({
  selector: 'ea-card',
  imports: [NgClass],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CardComponent {
  // Inputs
  readonly variant = input<CardVariant>('elevated');
  readonly padding = input<CardPadding>('md');
  readonly fullWidth = input<boolean>(false);
  readonly headerAlign = input<CardHeaderAlign>('center');

  // Computed
  readonly hostClasses = computed(() => ({
    [`ea-card--${this.variant()}`]: true,
    [`ea-card--padding-${this.padding()}`]: true,
    'ea-card--full-width': this.fullWidth(),
  }));
}
