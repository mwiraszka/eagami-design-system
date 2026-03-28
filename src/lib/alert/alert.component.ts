import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';

import { AlertCircleIconComponent } from '../icons/alert-circle.component';
import { CheckIconComponent } from '../icons/check.component';
import { InfoIconComponent } from '../icons/info.component';
import { XIconComponent } from '../icons/x.component';

export type AlertVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'ea-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertCircleIconComponent,
    CheckIconComponent,
    InfoIconComponent,
    XIconComponent,
  ],
})
export class AlertComponent {
  readonly variant = input<AlertVariant>('default');
  readonly dismissible = input<boolean>(false);
  readonly visible = model<boolean>(true);

  readonly dismissed = output<void>();

  readonly alertClasses = computed(() => ({
    [`ea-alert--${this.variant()}`]: true,
  }));

  dismiss(): void {
    this.visible.set(false);
    this.dismissed.emit();
  }
}
