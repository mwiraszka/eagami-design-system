import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
} from '@angular/core';

import { TabsComponent } from './tabs.component';

@Component({
  selector: 'ea-tab',
  host: { '[style.display]': 'isActive() ? null : "none"' },
  template: `
    @if (isActive()) {
      <div
        class="ea-tab__panel"
        role="tabpanel">
        <ng-content />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent implements OnInit, OnDestroy {
  private readonly tabs = inject(TabsComponent);

  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly disabled = input<boolean>(false);

  readonly isActive = computed(() => this.tabs.activeTab() === this.value());

  ngOnInit(): void {
    this.tabs.registerTab(this);
  }

  ngOnDestroy(): void {
    this.tabs.unregisterTab(this);
  }
}
