import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ea-icon-microsoft',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: inline-flex; width: 1em; height: 1em;' },
  template: `
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      width="100%"
      height="100%">
      <rect
        x="1"
        y="1"
        width="10"
        height="10"
        fill="#F25022" />
      <rect
        x="13"
        y="1"
        width="10"
        height="10"
        fill="#7FBA00" />
      <rect
        x="1"
        y="13"
        width="10"
        height="10"
        fill="#00A4EF" />
      <rect
        x="13"
        y="13"
        width="10"
        height="10"
        fill="#FFB900" />
    </svg>
  `,
})
export class MicrosoftIconComponent {}
