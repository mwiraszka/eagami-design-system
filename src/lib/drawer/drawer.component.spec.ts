import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerComponent, DrawerPosition, DrawerSize } from './drawer.component';

// Mock HTMLDialogElement methods for jsdom
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = jest.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

@Component({
  selector: 'ea-test-host',
  imports: [DrawerComponent],
  template: `
    <ea-drawer
      [(open)]="isOpen"
      [position]="position()"
      [size]="size()"
      [closeOnBackdrop]="closeOnBackdrop()"
      [closeOnEscape]="closeOnEscape()"
      [showClose]="showClose()">
      <span slot="header">Drawer Title</span>
      Drawer body content
      <span slot="footer">Footer</span>
    </ea-drawer>
  `,
})
class TestHostComponent {
  isOpen = signal(false);
  position = signal<DrawerPosition>('right');
  size = signal<DrawerSize>('md');
  closeOnBackdrop = signal(true);
  closeOnEscape = signal(true);
  showClose = signal(true);
}

describe('DrawerComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  function getDrawer(): HTMLDialogElement {
    return fixture.nativeElement.querySelector('dialog.ea-drawer');
  }

  function getPanel(): HTMLElement {
    return fixture.nativeElement.querySelector('.ea-drawer__panel');
  }

  function getCloseButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.ea-drawer__close');
  }

  beforeEach(async () => {
    (HTMLDialogElement.prototype.showModal as jest.Mock).mockClear();
    (HTMLDialogElement.prototype.close as jest.Mock).mockClear();

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders a dialog element', () => {
      expect(getDrawer()).toBeTruthy();
    });

    it('does not show the drawer by default', () => {
      expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
    });

    it('applies the default position class', () => {
      expect(getPanel().classList).toContain('ea-drawer__panel--right');
    });

    it('applies the default size class', () => {
      expect(getPanel().classList).toContain('ea-drawer__panel--md');
    });

    it('applies position classes for each side', () => {
      host.position.set('left');
      fixture.detectChanges();
      expect(getPanel().classList).toContain('ea-drawer__panel--left');

      host.position.set('top');
      fixture.detectChanges();
      expect(getPanel().classList).toContain('ea-drawer__panel--top');

      host.position.set('bottom');
      fixture.detectChanges();
      expect(getPanel().classList).toContain('ea-drawer__panel--bottom');
    });

    it('applies different size classes', () => {
      host.size.set('lg');
      fixture.detectChanges();
      expect(getPanel().classList).toContain('ea-drawer__panel--lg');
    });
  });

  // ── Opening and closing ───────────────────────────────────────────────────

  describe('Opening and closing', () => {
    it('opens when open is set to true', () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });

    it('closes when open is set to false', () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      host.isOpen.set(false);
      fixture.detectChanges();

      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });
  });

  // ── Close button ──────────────────────────────────────────────────────────

  describe('Close button', () => {
    it('renders a close button by default', () => {
      expect(getCloseButton()).toBeTruthy();
    });

    it('hides the close button when showClose is false', () => {
      host.showClose.set(false);
      fixture.detectChanges();

      expect(getCloseButton()).toBeNull();
    });

    it('closes drawer when close button is clicked', () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      getCloseButton()!.click();
      fixture.detectChanges();

      expect(host.isOpen()).toBe(false);
    });
  });

  // ── Backdrop ──────────────────────────────────────────────────────────────

  describe('Backdrop click', () => {
    it('closes on backdrop click when closeOnBackdrop is true', () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      const drawer = getDrawer();
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: drawer });
      drawer.dispatchEvent(event);
      fixture.detectChanges();

      expect(host.isOpen()).toBe(false);
    });

    it('does not close on backdrop click when closeOnBackdrop is false', () => {
      host.closeOnBackdrop.set(false);
      host.isOpen.set(true);
      fixture.detectChanges();

      const drawer = getDrawer();
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: drawer });
      drawer.dispatchEvent(event);
      fixture.detectChanges();

      expect(host.isOpen()).toBe(true);
    });

    it('does not close when click target is inside the panel', () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      const panel = getPanel();
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: panel });
      getDrawer().dispatchEvent(event);
      fixture.detectChanges();

      expect(host.isOpen()).toBe(true);
    });
  });

  // ── Escape key ────────────────────────────────────────────────────────────

  describe('Escape key', () => {
    it('closes on cancel event when closeOnEscape is true', () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      getDrawer().dispatchEvent(new Event('cancel'));
      fixture.detectChanges();

      expect(host.isOpen()).toBe(false);
    });

    it('prevents close on cancel when closeOnEscape is false', () => {
      host.closeOnEscape.set(false);
      host.isOpen.set(true);
      fixture.detectChanges();

      const event = new Event('cancel', { cancelable: true });
      getDrawer().dispatchEvent(event);
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(true);
      expect(host.isOpen()).toBe(true);
    });
  });

  // ── Content projection ───────────────────────────────────────────────────

  describe('Content projection', () => {
    it('projects header content', () => {
      const header = fixture.nativeElement.querySelector('.ea-drawer__header');

      expect(header.textContent).toContain('Drawer Title');
    });

    it('projects body content', () => {
      const body = fixture.nativeElement.querySelector('.ea-drawer__body');

      expect(body.textContent).toContain('Drawer body content');
    });

    it('projects footer content', () => {
      const footer = fixture.nativeElement.querySelector('.ea-drawer__footer');

      expect(footer.textContent).toContain('Footer');
    });
  });
});
