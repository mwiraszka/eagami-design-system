import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ea-icon-chevron-right',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: inline-flex;' },
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      width="100%"
      height="100%">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  `,
})
export class ChevronRightIconComponent {}
