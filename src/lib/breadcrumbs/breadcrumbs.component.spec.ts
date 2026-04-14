import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  BreadcrumbClickEvent,
  BreadcrumbItem,
  BreadcrumbsComponent,
} from './breadcrumbs.component';

describe('BreadcrumbsComponent', () => {
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let component: BreadcrumbsComponent;

  const defaultItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Laptops' },
  ];

  function getItems(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.ea-breadcrumbs__item'));
  }

  function getLinks(): HTMLAnchorElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('a.ea-breadcrumbs__link'));
  }

  function getCurrent(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-breadcrumbs__current');
  }

  function getSeparators(): HTMLElement[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('.ea-breadcrumbs__separator'),
    );
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', defaultItems);
    fixture.detectChanges();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders a nav with the correct aria-label', () => {
      const nav = fixture.nativeElement.querySelector('nav.ea-breadcrumbs');

      expect(nav).toBeTruthy();
      expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('renders one list item per input item', () => {
      expect(getItems()).toHaveLength(3);
    });

    it('renders anchor elements for items with an href (except last)', () => {
      const links = getLinks();

      expect(links).toHaveLength(2);
      expect(links[0].getAttribute('href')).toBe('/');
      expect(links[1].getAttribute('href')).toBe('/products');
    });

    it('renders last item as current page with aria-current', () => {
      const current = getCurrent();

      expect(current?.textContent?.trim()).toBe('Laptops');
      expect(current?.getAttribute('aria-current')).toBe('page');
    });

    it('renders one fewer separator than items', () => {
      expect(getSeparators()).toHaveLength(2);
    });

    it('renders a button for items without an href (except last)', () => {
      fixture.componentRef.setInput('items', [
        { label: 'Root' },
        { label: 'Branch' },
        { label: 'Leaf' },
      ]);
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll(
        'button.ea-breadcrumbs__link',
      );

      expect(buttons).toHaveLength(2);
    });
  });

  // ── Separators ─────────────────────────────────────────────────────────────

  describe('Separator', () => {
    it('uses chevron icon by default', () => {
      const icons = fixture.nativeElement.querySelectorAll('ea-icon-chevron-right');

      expect(icons).toHaveLength(2);
    });

    it('uses slash when separator is "slash"', () => {
      fixture.componentRef.setInput('separator', 'slash');
      fixture.detectChanges();

      const slashes = fixture.nativeElement.querySelectorAll(
        '.ea-breadcrumbs__separator--slash',
      );

      expect(slashes).toHaveLength(2);
      expect(slashes[0].textContent.trim()).toBe('/');
    });
  });

  // ── Click handling ─────────────────────────────────────────────────────────

  describe('Click handling', () => {
    it('emits itemClicked with the item and index', () => {
      const spy = jest.fn<void, [BreadcrumbClickEvent]>();
      component.itemClicked.subscribe(spy);

      getLinks()[0].click();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ index: 0, item: defaultItems[0] }),
      );
    });

    it('does not emit on last item click', () => {
      const spy = jest.fn();
      component.itemClicked.subscribe(spy);

      getCurrent()?.click();

      expect(spy).not.toHaveBeenCalled();
    });

    it('does not emit on disabled item click', () => {
      fixture.componentRef.setInput('items', [
        { label: 'Home', href: '/' },
        { label: 'Archive', href: '/archive', disabled: true },
        { label: 'Item' },
      ]);
      fixture.detectChanges();

      const spy = jest.fn();
      component.itemClicked.subscribe(spy);

      const disabled = fixture.nativeElement.querySelector(
        '.ea-breadcrumbs__link--disabled',
      );
      disabled.click();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  // ── Edge cases ─────────────────────────────────────────────────────────────

  describe('Edge cases', () => {
    it('handles an empty item list', () => {
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();

      expect(getItems()).toHaveLength(0);
      expect(getSeparators()).toHaveLength(0);
    });

    it('handles a single item as current page', () => {
      fixture.componentRef.setInput('items', [{ label: 'Home' }]);
      fixture.detectChanges();

      expect(getItems()).toHaveLength(1);
      expect(getSeparators()).toHaveLength(0);
      expect(getCurrent()?.textContent?.trim()).toBe('Home');
    });

    it('accepts a custom aria-label', () => {
      fixture.componentRef.setInput('aria-label', 'Page navigation');
      fixture.detectChanges();

      const nav = fixture.nativeElement.querySelector('nav.ea-breadcrumbs');

      expect(nav.getAttribute('aria-label')).toBe('Page navigation');
    });
  });
});
