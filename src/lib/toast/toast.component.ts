import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';

import { XIconComponent } from '../icons/x.component';
import { ToastService } from './toast.service';

@Component({
  selector: 'ea-toast',
  imports: [XIconComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);
}
