import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { MenuComponent } from './menu.component';

export type MenuItemVariant = 'default' | 'danger';

@Component({
  selector: 'ea-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemComponent {
  private readonly menu = inject(MenuComponent, { optional: true });

  // Inputs
  readonly disabled = input<boolean>(false);
  readonly variant = input<MenuItemVariant>('default');

  // Outputs
  readonly itemClicked = output<MouseEvent>();

  handleClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.itemClicked.emit(event);
    this.menu?.close();
  }
}
