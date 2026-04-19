import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { EagamiIconComponent } from '../icons/eagami.component';

export type EagamiWordmarkVariant = 1 | 2 | 3 | 4;
export type EagamiWordmarkLayout = 'stacked' | 'inline';

@Component({
  selector: 'ea-eagami-wordmark',
  imports: [EagamiIconComponent],
  templateUrl: './eagami-wordmark.component.html',
  styleUrl: './eagami-wordmark.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--_size]': 'size()',
  },
})
export class EagamiWordmarkComponent {
  readonly variant = input<EagamiWordmarkVariant>(1);
  readonly layout = input<EagamiWordmarkLayout>('stacked');
  readonly size = input<number>(32);

  protected readonly showOverline = computed(() => this.variant() === 2);

  protected readonly showTagline = computed(() => this.variant() === 4);

  protected readonly brandText = computed(() => {
    const variant = this.variant();
    if (variant <= 2) return 'eagami';
    return 'eagami design system';
  });

  protected readonly ariaLabel = computed(() => {
    switch (this.variant()) {
      case 1:
        return 'eagami';
      case 2:
        return 'handcrafted by eagami';
      case 3:
        return 'eagami design system';
      case 4:
        return 'eagami design system \u2014 elegant web design';
    }
  });
}
