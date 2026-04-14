import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ea-icon-menu',
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
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6" />
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12" />
      <line
        x1="3"
        y1="18"
        x2="21"
        y2="18" />
    </svg>
  `,
})
export class MenuIconComponent {}
