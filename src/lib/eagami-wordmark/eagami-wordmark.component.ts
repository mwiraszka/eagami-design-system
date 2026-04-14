import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { EagamiIconComponent } from '../icons/eagami.component';

export type EagamiWordmarkVariant = 'logo' | 'signature' | 'brand';
export type EagamiWordmarkSize = 'sm' | 'md' | 'lg';
export type EagamiWordmarkText = 'eagami' | 'eagami design system';

@Component({
  selector: 'ea-eagami-wordmark',
  imports: [EagamiIconComponent],
  templateUrl: './eagami-wordmark.component.html',
  styleUrl: './eagami-wordmark.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EagamiWordmarkComponent {
  readonly variant = input<EagamiWordmarkVariant>('logo');
  readonly size = input<EagamiWordmarkSize>('md');
  readonly text = input<EagamiWordmarkText>('eagami');

  protected readonly ariaLabel = computed(() => {
    const variant = this.variant();
    const text = this.text();
    if (variant === 'signature') return `handcrafted by ${text}`;
    if (variant === 'brand') return `${text} — elegant web design`;
    return text;
  });
}
