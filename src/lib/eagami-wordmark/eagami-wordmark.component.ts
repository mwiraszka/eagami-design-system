import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EagamiIconComponent } from '../icons/eagami.component';

export type EagamiWordmarkVariant = 'logo' | 'signature' | 'brand';
export type EagamiWordmarkSize = 'sm' | 'md' | 'lg';

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
}
