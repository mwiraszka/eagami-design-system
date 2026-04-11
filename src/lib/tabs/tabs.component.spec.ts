import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';

@Component({
  imports: [TabsComponent, TabComponent],
  template: `
    <ea-tabs [(activeTab)]="activeTab">
      <ea-tab
        value="one"
        label="Tab One">
        Content one
      </ea-tab>
      <ea-tab
        value="two"
        label="Tab Two">
        Content two
      </ea-tab>
      <ea-tab
        value="three"
        label="Tab Three"
        [disabled]="true">
        Content three
      </ea-tab>
    </ea-tabs>
  `,
})
class TestHostComponent {
  activeTab = 'one';
}

describe('TabsComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  function getTriggers(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));
  }

  function getTabList(): HTMLElement {
    return fixture.nativeElement.querySelector('[role="tablist"]');
  }

  function getPanel(): HTMLElement | null {
    return fixture.nativeElement.querySelector('[role="tabpanel"]');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('renders tab triggers for each ea-tab', () => {
      expect(getTriggers().length).toBe(3);
    });

    it('renders trigger labels', () => {
      const labels = getTriggers().map(t => t.textContent?.trim());
      expect(labels).toEqual(['Tab One', 'Tab Two', 'Tab Three']);
    });

    it('renders a tablist role', () => {
      expect(getTabList()).toBeTruthy();
    });

    it('shows the active tab panel', () => {
      expect(getPanel()?.textContent?.trim()).toBe('Content one');
    });
  });

  describe('Tab selection', () => {
    it('switches content when a trigger is clicked', () => {
      getTriggers()[1].click();
      fixture.detectChanges();
      expect(getPanel()?.textContent?.trim()).toBe('Content two');
    });

    it('updates activeTab on the host', () => {
      getTriggers()[1].click();
      fixture.detectChanges();
      expect(fixture.componentInstance.activeTab).toBe('two');
    });

    it('marks the active trigger with aria-selected', () => {
      expect(getTriggers()[0].getAttribute('aria-selected')).toBe('true');
      expect(getTriggers()[1].getAttribute('aria-selected')).toBe('false');
    });

    it('sets tabindex 0 on active trigger and -1 on others', () => {
      expect(getTriggers()[0].tabIndex).toBe(0);
      expect(getTriggers()[1].tabIndex).toBe(-1);
    });
  });

  describe('Disabled tabs', () => {
    it('disables the trigger button', () => {
      expect(getTriggers()[2].disabled).toBe(true);
    });

    it('does not switch to a disabled tab on click', () => {
      getTriggers()[2].click();
      fixture.detectChanges();
      expect(getPanel()?.textContent?.trim()).toBe('Content one');
    });
  });

  describe('Keyboard navigation', () => {
    it('moves to next tab on ArrowRight', () => {
      getTabList().dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
      );
      fixture.detectChanges();
      expect(getPanel()?.textContent?.trim()).toBe('Content two');
    });

    it('wraps around on ArrowRight at end', () => {
      fixture.componentInstance.activeTab = 'two';
      fixture.detectChanges();
      // "two" is index 1 of enabled tabs, ArrowRight goes to index 0 (wraps, skips disabled)
      getTabList().dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
      );
      fixture.detectChanges();
      expect(getPanel()?.textContent?.trim()).toBe('Content one');
    });

    it('moves to previous tab on ArrowLeft', () => {
      fixture.componentInstance.activeTab = 'two';
      fixture.detectChanges();
      getTabList().dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
      );
      fixture.detectChanges();
      expect(getPanel()?.textContent?.trim()).toBe('Content one');
    });

    it('moves to first tab on Home', () => {
      fixture.componentInstance.activeTab = 'two';
      fixture.detectChanges();
      getTabList().dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
      );
      fixture.detectChanges();
      expect(getPanel()?.textContent?.trim()).toBe('Content one');
    });

    it('moves to last enabled tab on End', () => {
      getTabList().dispatchEvent(
        new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
      );
      fixture.detectChanges();
      expect(getPanel()?.textContent?.trim()).toBe('Content two');
    });
  });

  describe('Variants', () => {
    it('applies underline variant by default', () => {
      expect(getTabList().classList).toContain('ea-tabs__list--underline');
    });
  });
});
