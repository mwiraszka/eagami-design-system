import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ea-icon-filter',
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  `,
})
export class FilterIconComponent {}
