import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';

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
  imports: [DialogComponent],
  template: `
    <ea-dialog
      [(open)]="isOpen"
      [size]="size()"
      [closeOnBackdrop]="closeOnBackdrop()"
      [closeOnEscape]="closeOnEscape()"
      [showClose]="showClose()">
      <span slot="header">Test Title</span>
      Dialog body content
      <span slot="footer">Footer</span>
    </ea-dialog>
  `,
})
class TestHostComponent {
  isOpen = signal(false);
  size = signal<'sm' | 'md' | 'lg' | 'full'>('md');
  closeOnBackdrop = signal(true);
  closeOnEscape = signal(true);
  showClose = signal(true);
}

describe('DialogComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  function getDialog(): HTMLDialogElement {
    return fixture.nativeElement.querySelector('dialog');
  }

  function getPanel(): HTMLElement {
    return fixture.nativeElement.querySelector('.ea-dialog__panel');
  }

  function getCloseButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.ea-dialog__close');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('renders a dialog element', () => {
      expect(getDialog()).toBeTruthy();
    });

    it('does not show the dialog by default', () => {
      expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
    });

    it('applies the default size class', () => {
      expect(getPanel().classList).toContain('ea-dialog__panel--md');
    });

    it('applies different size classes', () => {
      host.size.set('lg');
      fixture.detectChanges();
      expect(getPanel().classList).toContain('ea-dialog__panel--lg');
    });
  });

  describe('Opening and closing', () => {
    it('opens the dialog when open is set to true', () => {
      host.isOpen.set(true);
      fixture.detectChanges();
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });

    it('closes the dialog when open is set to false', () => {
      host.isOpen.set(true);
      fixture.detectChanges();
      host.isOpen.set(false);
      fixture.detectChanges();
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });
  });

  describe('Close button', () => {
    it('renders a close button by default', () => {
      expect(getCloseButton()).toBeTruthy();
    });

    it('hides the close button when showClose is false', () => {
      host.showClose.set(false);
      fixture.detectChanges();
      expect(getCloseButton()).toBeNull();
    });

    it('closes dialog when close button is clicked', () => {
      host.isOpen.set(true);
      fixture.detectChanges();
      getCloseButton()!.click();
      fixture.detectChanges();
      expect(host.isOpen()).toBe(false);
    });
  });

  describe('Backdrop click', () => {
    it('closes on backdrop click when closeOnBackdrop is true', () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      const dialog = getDialog();
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: dialog });
      dialog.dispatchEvent(event);
      fixture.detectChanges();

      expect(host.isOpen()).toBe(false);
    });

    it('does not close on backdrop click when closeOnBackdrop is false', () => {
      host.closeOnBackdrop.set(false);
      host.isOpen.set(true);
      fixture.detectChanges();

      const dialog = getDialog();
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: dialog });
      dialog.dispatchEvent(event);
      fixture.detectChanges();

      expect(host.isOpen()).toBe(true);
    });
  });

  describe('Escape key', () => {
    it('closes on cancel event when closeOnEscape is true', () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      const dialog = getDialog();
      dialog.dispatchEvent(new Event('cancel'));
      fixture.detectChanges();

      expect(host.isOpen()).toBe(false);
    });

    it('prevents close on cancel when closeOnEscape is false', () => {
      host.closeOnEscape.set(false);
      host.isOpen.set(true);
      fixture.detectChanges();

      const dialog = getDialog();
      const event = new Event('cancel', { cancelable: true });
      dialog.dispatchEvent(event);
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(true);
      expect(host.isOpen()).toBe(true);
    });
  });

  describe('Content projection', () => {
    it('projects header content', () => {
      const header = fixture.nativeElement.querySelector('.ea-dialog__header');
      expect(header.textContent).toContain('Test Title');
    });

    it('projects body content', () => {
      const body = fixture.nativeElement.querySelector('.ea-dialog__body');
      expect(body.textContent).toContain('Dialog body content');
    });

    it('projects footer content', () => {
      const footer = fixture.nativeElement.querySelector('.ea-dialog__footer');
      expect(footer.textContent).toContain('Footer');
    });
  });
});
