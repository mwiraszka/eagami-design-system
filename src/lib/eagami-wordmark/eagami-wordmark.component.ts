import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { EagamiIconComponent } from '../icons/eagami.component';

export type EagamiWordmarkText =
  | 'eagami'
  | 'handcrafted by eagami'
  | 'eagami design system'
  | 'eagami design system \u2014 elegant web design';
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
  readonly text = input<EagamiWordmarkText>('eagami');
  readonly layout = input<EagamiWordmarkLayout>('stacked');
  readonly size = input<number>(32);

  protected readonly showOverline = computed(
    () => this.text() === 'handcrafted by eagami',
  );

  protected readonly showTagline = computed(
    () => this.text() === 'eagami design system \u2014 elegant web design',
  );

  protected readonly brandText = computed(() => {
    const text = this.text();
    if (text === 'handcrafted by eagami') return 'eagami';
    if (text === 'eagami design system \u2014 elegant web design')
      return 'eagami design system';
    return text;
  });
}
