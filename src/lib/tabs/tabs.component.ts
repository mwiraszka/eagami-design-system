import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  signal,
} from '@angular/core';

import { TabComponent } from './tab.component';

export type TabsVariant = 'underline' | 'filled';
export type TabsSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ea-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  readonly registeredTabs = signal<TabComponent[]>([]);

  readonly variant = input<TabsVariant>('underline');
  readonly size = input<TabsSize>('md');

  readonly activeTab = model<string>('');

  readonly tabChange = output<string>();

  registerTab(tab: TabComponent): void {
    this.registeredTabs.update(tabs => [...tabs, tab]);
  }

  unregisterTab(tab: TabComponent): void {
    this.registeredTabs.update(tabs => tabs.filter(t => t !== tab));
  }

  selectTab(value: string): void {
    this.activeTab.set(value);
    this.tabChange.emit(value);
  }

  handleKeydown(event: KeyboardEvent): void {
    const tabList = this.registeredTabs().filter(t => !t.disabled());
    const currentIndex = tabList.findIndex(t => t.value() === this.activeTab());
    let nextIndex = -1;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextIndex = currentIndex < tabList.length - 1 ? currentIndex + 1 : 0;
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      nextIndex = currentIndex > 0 ? currentIndex - 1 : tabList.length - 1;
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      nextIndex = tabList.length - 1;
    }

    if (nextIndex >= 0) {
      const tab = tabList[nextIndex];
      this.selectTab(tab.value());
      const buttons = (
        event.currentTarget as HTMLElement
      ).querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])');
      buttons[nextIndex]?.focus();
    }
  }
}
