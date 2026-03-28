import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

@Component({
  selector: 'ea-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  readonly variant = input<SkeletonVariant>('text');
  readonly width = input<string | undefined>(undefined);
  readonly height = input<string | undefined>(undefined);
  readonly animated = input<boolean>(true);

  readonly hostStyles = computed(() => {
    const styles: Record<string, string> = {};
    if (this.width()) styles['width'] = this.width()!;
    if (this.height()) styles['height'] = this.height()!;
    return styles;
  });

  readonly hostClasses = computed(() => ({
    [`ea-skeleton--${this.variant()}`]: true,
    'ea-skeleton--animated': this.animated(),
  }));
}
