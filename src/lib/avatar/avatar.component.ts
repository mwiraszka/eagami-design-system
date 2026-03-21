import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';

import { UserIconComponent } from '../icons/user.component';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

@Component({
  selector: 'ea-avatar',
  imports: [NgClass, UserIconComponent],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AvatarComponent {
  readonly src = input<string | undefined>(undefined);
  readonly alt = input<string>('');
  readonly initials = input<string | undefined>(undefined);
  readonly size = input<AvatarSize>('md');
  readonly shape = input<AvatarShape>('circle');

  readonly hostClasses = computed(() => ({
    [`ea-avatar--${this.size()}`]: true,
    [`ea-avatar--${this.shape()}`]: true,
  }));

  readonly showImage = computed(() => !!this.src());
  readonly showInitials = computed(() => !this.src() && !!this.initials());
  readonly showFallback = computed(() => !this.src() && !this.initials());

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
