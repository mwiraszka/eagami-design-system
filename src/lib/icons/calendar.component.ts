import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ea-icon-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: inline-flex; width: 1em; height: 1em;' },
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
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        ry="2" />
      <line
        x1="16"
        y1="2"
        x2="16"
        y2="6" />
      <line
        x1="8"
        y1="2"
        x2="8"
        y2="6" />
      <line
        x1="3"
        y1="10"
        x2="21"
        y2="10" />
    </svg>
  `,
})
export class CalendarIconComponent {}
