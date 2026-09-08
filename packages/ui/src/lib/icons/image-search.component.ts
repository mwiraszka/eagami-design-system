import { ChangeDetectionStrategy, Component } from '@angular/core';

import { type IconCategory, IconComponentBase } from './icon-category';

@Component({
  selector: 'ea-icon-image-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      width="100%"
      height="100%">
      <path d="M12.5 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
      <polyline points="19 17 13.5 11.5 5 21" />
      <circle
        cx="17.5"
        cy="6.5"
        r="3" />
      <path d="m19.7 8.7 2 2" />
    </svg>
  `,
})
export class ImageSearchIconComponent extends IconComponentBase {
  static readonly slug = 'image-search';
  static readonly category: IconCategory = 'eagami';
  static readonly tags: ReadonlyArray<string> = [
    'image-search',
    'find image',
    'search photo',
    'magnifier',
    'gallery',
    'rechercher une image',
    'buscar imagen',
    'αναζήτηση εικόνας',
    'szukaj obrazu',
  ];
}
