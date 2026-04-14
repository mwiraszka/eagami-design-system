import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemComponent } from './menu-item.component';
import { MenuComponent, MenuPlacement } from './menu.component';

@Component({
  selector: 'ea-test-host',
  imports: [MenuComponent, MenuItemComponent],
  template: `
    <ea-menu
      [(open)]="isOpen"
      [placement]="placement()"
      [disabled]="disabled()">
      <button slot="trigger">Open</button>
      <ea-menu-item (itemClicked)="onEdit()">Edit</ea-menu-item>
      <ea-menu-item [disabled]="itemDisabled()">Archive</ea-menu-item>
      <ea-menu-item
        variant="danger"
        (itemClicked)="onDelete()">
        Delete
      </ea-menu-item>
    </ea-menu>
  `,
})
class TestHostComponent {
  isOpen = signal(false);
  placement = signal<MenuPlacement>('bottom-start');
  disabled = signal(false);
  itemDisabled = signal(false);
  editCount = 0;
  deleteCount = 0;

  onEdit(): void {
    this.editCount++;
  }

  onDelete(): void {
    this.deleteCount++;
  }
}

describe('MenuComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  function getTrigger(): HTMLElement {
    return fixture.nativeElement.querySelector('.ea-menu__trigger');
  }

  function getList(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-menu__list');
  }

  function getItems(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.ea-menu-item'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders the trigger', () => {
      expect(getTrigger()).toBeTruthy();
    });

    it('does not render the menu list when closed', () => {
      expect(getList()).toBeNull();
    });

    it('renders the menu list when open', () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      expect(getList()).toBeTruthy();
    });

    it('renders all menu items when open', () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      expect(getItems().length).toBe(3);
    });

    it('applies the default placement class', () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      expect(getList()!.classList).toContain('ea-menu__list--bottom-start');
    });

    it('applies placement classes', () => {
      host.isOpen.set(true);
      host.placement.set('top-end');
      fixture.detectChanges();

      expect(getList()!.classList).toContain('ea-menu__list--top-end');
    });
  });

  // ── Opening and closing ───────────────────────────────────────────────────

  describe('Opening and closing', () => {
    it('opens when trigger is clicked', () => {
      getTrigger().click();
      fixture.detectChanges();

      expect(host.isOpen()).toBe(true);
    });

    it('closes when trigger is clicked again', () => {
      getTrigger().click();
      fixture.detectChanges();

      getTrigger().click();
      fixture.detectChanges();

      expect(host.isOpen()).toBe(false);
    });

    it('does not open when disabled', () => {
      host.disabled.set(true);
      fixture.detectChanges();

      getTrigger().click();
      fixture.detectChanges();

      expect(host.isOpen()).toBe(false);
    });

    it('opens on ArrowDown from trigger', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      getTrigger().dispatchEvent(event);
      fixture.detectChanges();

      expect(host.isOpen()).toBe(true);
    });

    it('opens on Enter from trigger', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      getTrigger().dispatchEvent(event);
      fixture.detectChanges();

      expect(host.isOpen()).toBe(true);
    });

    it('closes on Escape keydown from trigger', () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      getTrigger().dispatchEvent(event);
      fixture.detectChanges();

      expect(host.isOpen()).toBe(false);
    });

    it('closes when clicking outside', () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      document.body.click();
      fixture.detectChanges();

      expect(host.isOpen()).toBe(false);
    });

    it('stays open when clicking inside the menu list', () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      const list = getList()!;
      list.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();

      expect(host.isOpen()).toBe(true);
    });
  });

  // ── Menu items ────────────────────────────────────────────────────────────

  describe('Menu items', () => {
    beforeEach(() => {
      host.isOpen.set(true);
      fixture.detectChanges();
    });

    it('emits itemClicked and closes the menu on click', () => {
      getItems()[0].click();
      fixture.detectChanges();

      expect(host.editCount).toBe(1);
      expect(host.isOpen()).toBe(false);
    });

    it('does not emit itemClicked when disabled', () => {
      host.itemDisabled.set(true);
      fixture.detectChanges();

      const archiveItem = getItems()[1];
      archiveItem.click();
      fixture.detectChanges();

      expect(host.isOpen()).toBe(true);
    });

    it('applies danger variant class', () => {
      const deleteItem = getItems()[2];

      expect(deleteItem.classList).toContain('ea-menu-item--danger');
    });

    it('applies disabled class when item is disabled', () => {
      host.itemDisabled.set(true);
      fixture.detectChanges();

      const archiveItem = getItems()[1];

      expect(archiveItem.classList).toContain('ea-menu-item--disabled');
    });

    it('emits itemClicked for danger items', () => {
      getItems()[2].click();
      fixture.detectChanges();

      expect(host.deleteCount).toBe(1);
    });
  });
});
