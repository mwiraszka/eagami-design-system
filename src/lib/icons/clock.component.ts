import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ea-icon-clock',
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
        r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  `,
})
export class ClockIconComponent {}
