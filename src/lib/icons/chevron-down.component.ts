import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ea-icon-chevron-down',
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
      <polyline points="6 9 12 15 18 9" />
    </svg>
  `,
})
export class ChevronDownIconComponent {}
