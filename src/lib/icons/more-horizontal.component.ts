import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ea-icon-more-horizontal',
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
      <circle
        cx="12"
        cy="12"
        r="1" />
      <circle
        cx="19"
        cy="12"
        r="1" />
      <circle
        cx="5"
        cy="12"
        r="1" />
    </svg>
  `,
})
export class MoreHorizontalIconComponent {}
