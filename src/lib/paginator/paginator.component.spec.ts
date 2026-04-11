import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent, PaginatorState } from './paginator.component';

describe('PaginatorComponent', () => {
  let fixture: ComponentFixture<PaginatorComponent>;
  let component: PaginatorComponent;

  function getPrevBtn(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[aria-label="Previous page"]')!;
  }

  function getNextBtn(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[aria-label="Next page"]')!;
  }

  function getPageButtonHosts(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.ea-paginator__page-btn'));
  }

  function getPageButtons(): HTMLButtonElement[] {
    return getPageButtonHosts().map(h => h.querySelector('button')!);
  }

  function getActivePageHost(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-paginator__page-btn--active');
  }

  function getActivePageButton(): HTMLButtonElement | null {
    return getActivePageHost()?.querySelector('button') ?? null;
  }

  function getRangeLabel(): string {
    const el: HTMLElement = fixture.nativeElement.querySelector('.ea-paginator__range');
    return el?.textContent?.trim() ?? '';
  }

  function getSelect(): HTMLSelectElement | null {
    return fixture.nativeElement.querySelector('.ea-paginator__select');
  }

  function getEllipses(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.ea-paginator__ellipsis'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('totalItems', 100);
    fixture.detectChanges();
  });

  // ── Placement ────────────────────────────────────────────────────────────

  describe('Placement', () => {
    it('defaults to right (no modifier class)', () => {
      const host = fixture.nativeElement.querySelector('.ea-paginator');

      expect(host.classList).not.toContain('ea-paginator--left');
      expect(host.classList).not.toContain('ea-paginator--center');
    });

    it('applies left placement class', () => {
      fixture.componentRef.setInput('placement', 'left');
      fixture.detectChanges();

      const host = fixture.nativeElement.querySelector('.ea-paginator');

      expect(host.classList).toContain('ea-paginator--left');
    });

    it('applies center placement class', () => {
      fixture.componentRef.setInput('placement', 'center');
      fixture.detectChanges();

      const host = fixture.nativeElement.querySelector('.ea-paginator');

      expect(host.classList).toContain('ea-paginator--center');
    });
  });

  // ── Rendering ────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders prev and next buttons', () => {
      expect(getPrevBtn()).toBeTruthy();
      expect(getNextBtn()).toBeTruthy();
    });

    it('renders page number buttons', () => {
      expect(getPageButtons().length).toBeGreaterThan(0);
    });

    it('highlights the current page', () => {
      expect(getActivePageButton()?.textContent?.trim()).toBe('1');
    });

    it('shows range label', () => {
      expect(getRangeLabel()).toBe('1–10 of 100');
    });

    it('shows page size selector by default', () => {
      expect(getSelect()).toBeTruthy();
    });

    it('hides page size selector when disabled', () => {
      fixture.componentRef.setInput('showPageSizeSelector', false);
      fixture.detectChanges();

      expect(getSelect()).toBeNull();
    });

    it('hides range label when disabled', () => {
      fixture.componentRef.setInput('showRangeLabel', false);
      fixture.detectChanges();

      const range = fixture.nativeElement.querySelector('.ea-paginator__range');

      expect(range).toBeNull();
    });

    it('shows 0–0 of 0 when totalItems is 0', () => {
      fixture.componentRef.setInput('totalItems', 0);
      fixture.detectChanges();

      expect(getRangeLabel()).toBe('0–0 of 0');
    });
  });

  // ── Navigation ───────────────────────────────────────────────────────────

  describe('Navigation', () => {
    it('disables prev button on first page', () => {
      expect(getPrevBtn().disabled).toBe(true);
    });

    it('enables next button when there are more pages', () => {
      expect(getNextBtn().disabled).toBe(false);
    });

    it('navigates to next page on next click', () => {
      getNextBtn().click();
      fixture.detectChanges();

      expect(component.page()).toBe(2);
      expect(getRangeLabel()).toBe('11–20 of 100');
    });

    it('navigates to prev page on prev click', () => {
      component.page.set(3);
      fixture.detectChanges();

      getPrevBtn().click();
      fixture.detectChanges();

      expect(component.page()).toBe(2);
    });

    it('disables next button on last page', () => {
      component.page.set(10);
      fixture.detectChanges();

      expect(getNextBtn().disabled).toBe(true);
    });

    it('navigates to specific page on page button click', () => {
      const page2Btn = getPageButtons().find(btn => btn.textContent?.trim() === '2');

      page2Btn?.click();
      fixture.detectChanges();

      expect(component.page()).toBe(2);
    });

    it('sets aria-current on active page button', () => {
      expect(getActivePageButton()?.getAttribute('aria-current')).toBe('page');
    });

    it('does not set aria-current on inactive page buttons', () => {
      const inactiveBtn = getPageButtons().find(btn => btn.textContent?.trim() === '2');

      expect(inactiveBtn?.getAttribute('aria-current')).toBeNull();
    });
  });

  // ── Page size ────────────────────────────────────────────────────────────

  describe('Page size', () => {
    it('renders page size options', () => {
      const options = getSelect()!.querySelectorAll('option');

      expect(options).toHaveLength(4);
      expect(options[0].value).toBe('10');
      expect(options[1].value).toBe('25');
    });

    it('resets to page 1 on page size change', () => {
      component.page.set(3);
      fixture.detectChanges();

      getSelect()!.value = '25';
      getSelect()!.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(component.page()).toBe(1);
      expect(component.pageSize()).toBe(25);
    });

    it('recalculates total pages on page size change', () => {
      getSelect()!.value = '25';
      getSelect()!.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(component.totalPages()).toBe(4);
    });

    it('emits changed on page size change', () => {
      const spy = jest.fn();
      component.changed.subscribe(spy);

      getSelect()!.value = '50';
      getSelect()!.dispatchEvent(new Event('change'));

      expect(spy).toHaveBeenCalledWith<[PaginatorState]>({
        page: 1,
        pageSize: 50,
      });
    });

    it('renders custom page size options', () => {
      fixture.componentRef.setInput('pageSizeOptions', [5, 15, 30]);
      fixture.detectChanges();

      const options = getSelect()!.querySelectorAll('option');

      expect(options).toHaveLength(3);
      expect(options[0].value).toBe('5');
    });
  });

  // ── Events ───────────────────────────────────────────────────────────────

  describe('Events', () => {
    it('emits changed on next click', () => {
      const spy = jest.fn();
      component.changed.subscribe(spy);

      getNextBtn().click();

      expect(spy).toHaveBeenCalledWith<[PaginatorState]>({
        page: 2,
        pageSize: 10,
      });
    });

    it('emits changed on prev click', () => {
      component.page.set(3);
      fixture.detectChanges();

      const spy = jest.fn();
      component.changed.subscribe(spy);

      getPrevBtn().click();

      expect(spy).toHaveBeenCalledWith<[PaginatorState]>({
        page: 2,
        pageSize: 10,
      });
    });

    it('emits changed on page button click', () => {
      const spy = jest.fn();
      component.changed.subscribe(spy);

      const page2 = getPageButtons().find(btn => btn.textContent?.trim() === '2');
      page2?.click();

      expect(spy).toHaveBeenCalledWith<[PaginatorState]>({
        page: 2,
        pageSize: 10,
      });
    });

    it('does not emit when clicking the already-active page', () => {
      const spy = jest.fn();
      component.changed.subscribe(spy);

      getActivePageButton()?.click();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  // ── Ellipsis ─────────────────────────────────────────────────────────────

  describe('Ellipsis', () => {
    it('shows ellipsis for many pages', () => {
      fixture.componentRef.setInput('totalItems', 200);
      fixture.detectChanges();

      expect(getEllipses().length).toBeGreaterThan(0);
    });

    it('does not show ellipsis for 7 or fewer pages', () => {
      fixture.componentRef.setInput('totalItems', 70);
      fixture.detectChanges();

      expect(getEllipses()).toHaveLength(0);
    });

    it('shows only trailing ellipsis on page 1', () => {
      fixture.componentRef.setInput('totalItems', 200);
      fixture.detectChanges();

      expect(getEllipses()).toHaveLength(1);
    });

    it('shows both ellipses when in the middle', () => {
      fixture.componentRef.setInput('totalItems', 200);
      component.page.set(10);
      fixture.detectChanges();

      expect(getEllipses()).toHaveLength(2);
    });
  });

  // ── Disabled state ───────────────────────────────────────────────────────

  describe('Disabled state', () => {
    it('disables all controls when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getPrevBtn().disabled).toBe(true);
      expect(getNextBtn().disabled).toBe(true);
      expect(getSelect()!.disabled).toBe(true);
    });

    it('does not navigate when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      component.nextPage();

      expect(component.page()).toBe(1);
    });

    it('applies disabled class to host', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const host = fixture.nativeElement.querySelector('.ea-paginator');

      expect(host.classList).toContain('ea-paginator--disabled');
    });
  });

  // ── Edge cases ───────────────────────────────────────────────────────────

  describe('Edge cases', () => {
    it('clamps goToPage to valid range', () => {
      component.goToPage(999);

      expect(component.page()).toBe(10);
    });

    it('clamps goToPage to 1 for negative values', () => {
      component.goToPage(-5);

      expect(component.page()).toBe(1);
    });

    it('handles totalItems of 1', () => {
      fixture.componentRef.setInput('totalItems', 1);
      fixture.detectChanges();

      expect(component.totalPages()).toBe(1);
      expect(getPrevBtn().disabled).toBe(true);
      expect(getNextBtn().disabled).toBe(true);
    });

    it('shows correct range on last page with partial items', () => {
      fixture.componentRef.setInput('totalItems', 95);
      component.page.set(10);
      fixture.detectChanges();

      expect(getRangeLabel()).toBe('91–95 of 95');
    });
  });
});
