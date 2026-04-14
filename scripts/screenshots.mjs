/* global process */
/**
 * Capture README component screenshots from the sandbox app.
 *
 * Starts the sandbox dev server, waits for it to be ready, then uses Puppeteer
 * to screenshot each `.sandbox-section` matched by its first <h2> text. Output
 * goes to docs/images/<name>.png at 2x resolution.
 *
 * Also captures individual icon screenshots by extracting SVG templates from
 * icon component files and rendering them in a minimal HTML page.
 *
 * Only captures screenshots for files that don't already exist. Pass --force
 * to overwrite all, or --force <name> to overwrite a specific screenshot
 * (e.g. --force button, --force alert-circle).
 *
 * Usage:
 *   pnpm screenshots              # only missing screenshots
 *   pnpm screenshots --force      # regenerate everything
 *   pnpm screenshots --force button data-table   # regenerate specific ones
 *
 * To add a new component screenshot:
 *   1. Add a sandbox section in sandbox.component.html
 *   2. Append an entry to the SECTIONS array below
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'docs/images');
const ICONS_OUT = resolve(OUT, 'icons');
const ICONS_SRC = resolve(ROOT, 'src/lib/icons');
const PORT = 4250;
const URL = `http://localhost:${PORT}`;
const VIEWPORT = { width: 640, height: 800, deviceScaleFactor: 2 };

/**
 * Each entry maps an output filename to the `<summary>` text of the
 * collapsible `<details>` sandbox section to capture.
 */
const SECTIONS = [
  { name: 'accordion', heading: 'Accordion', prepare: expandAccordionItems },
  { name: 'alert', heading: 'Alert' },
  { name: 'autocomplete', heading: 'Autocomplete', prepare: openAutocompleteList },
  { name: 'avatar', heading: 'Avatar' },
  { name: 'avatar-editor', heading: 'Avatar Editor', prepare: showAvatarEditorHover },
  { name: 'badge', heading: 'Badge' },
  { name: 'breadcrumbs', heading: 'Breadcrumbs' },
  { name: 'button', heading: 'Button' },
  { name: 'card', heading: 'Card' },
  { name: 'checkbox', heading: 'Checkbox' },
  { name: 'code-input', heading: 'Code Input', prepare: fillCodeInputs },
  { name: 'data-table', heading: 'Data Table' },
  { name: 'date-picker', heading: 'Date Picker', prepare: openDatePickerCalendar },
  { name: 'dialog', heading: 'Dialog', prepare: showDialogInline },
  { name: 'divider', heading: 'Divider' },
  { name: 'drawer', heading: 'Drawer', prepare: showDrawersInline },
  { name: 'dropdown', heading: 'Dropdown', prepare: openDropdownMenus },
  { name: 'eagami-wordmark', heading: 'Eagami Wordmark' },
  { name: 'input', heading: 'Input' },
  { name: 'menu', heading: 'Menu', prepare: openMenusInline },
  { name: 'paginator', heading: 'Paginator' },
  { name: 'progress-bar', heading: 'Progress Bar', prepare: pauseIndeterminateProgress },
  { name: 'radio', heading: 'Radio' },
  { name: 'skeleton', heading: 'Skeleton' },
  { name: 'spinner', heading: 'Spinner' },
  { name: 'switch', heading: 'Switch' },
  { name: 'tabs', heading: 'Tabs' },
  { name: 'tag', heading: 'Tag' },
  { name: 'textarea', heading: 'Textarea' },
  { name: 'toast', heading: 'Toast' },
  { name: 'tooltip', heading: 'Tooltip', prepare: showTooltips },
];

/**
 * The "circle with existing image + crop state" avatar editor is the third
 * editor in the Avatar Editor section. Force its hover overlay visible so the
 * captured screenshot shows the "change photo" overlay text.
 */
async function showAvatarEditorHover(page, section) {
  // Give the canvas a moment to render the loaded image before we screenshot
  await new Promise(r => setTimeout(r, 500));

  await section.evaluate(el => {
    const editors = el.querySelectorAll('ea-avatar-editor');
    const target = editors[2];
    if (!target) return;
    const overlay = target.querySelector('.ea-avatar-editor__canvas-overlay');
    if (overlay instanceof HTMLElement) {
      overlay.style.opacity = '1';
    }
  });
}

/**
 * Menu screenshots are more useful when each variant shows both the trigger
 * button AND the opened menu list. We override the list's absolute positioning
 * so lists flow inline below their triggers (otherwise adjacent menus overlap),
 * then open every menu via the Angular debug API.
 */
async function openMenusInline(page, section) {
  await page.addStyleTag({
    content: `
      .sandbox-section .ea-menu__list {
        position: static !important;
        max-height: none !important;
        margin-top: 4px !important;
      }
    `,
  });

  await section.evaluate(el => {
    const menus = el.querySelectorAll('ea-menu');
    for (const m of menus) {
      const component = window.ng?.getComponent?.(m);
      if (component?.open?.set) {
        component.open.set(true);
      }
    }
    for (const m of menus) {
      const component = window.ng?.getComponent?.(m);
      if (component) {
        window.ng.applyChanges(component);
      }
    }
  });

  await new Promise(r => setTimeout(r, 200));
}

/**
 * Open one item in the "single" accordion and two items in the "multi"
 * accordion so the screenshot shows expanded content rather than all-collapsed
 * rows.
 */
async function expandAccordionItems(page, section) {
  await section.evaluate(el => {
    const accordions = el.querySelectorAll('ea-accordion');
    const single = window.ng?.getComponent?.(accordions[0]);
    if (single?.expandedItems?.set) {
      single.expandedItems.set(new Set(['what']));
      window.ng.applyChanges(single);
    }
    const multi = window.ng?.getComponent?.(accordions[1]);
    if (multi?.expandedItems?.set) {
      multi.expandedItems.set(new Set(['one', 'two']));
      window.ng.applyChanges(multi);
    }
  });
  await new Promise(r => setTimeout(r, 150));
}

/**
 * Open the listbox of the "basic" autocomplete with a single letter of input
 * so the screenshot shows both the filtered dropdown (angular, react, svelte,
 * preact) and a non-empty "Value: a" preview below. The listbox is absolute-
 * positioned, so we override it to flow inline below the input (otherwise it
 * would overlap the next field).
 */
async function openAutocompleteList(page, section) {
  await page.addStyleTag({
    content: `
      .sandbox-section .ea-autocomplete__listbox {
        position: static !important;
        max-height: none !important;
        margin-top: 4px !important;
      }
    `,
  });

  await section.evaluate(el => {
    const autocompletes = el.querySelectorAll('ea-autocomplete');
    const basic = window.ng?.getComponent?.(autocompletes[0]);
    if (basic?.isOpen?.set) {
      basic.value.set('a');
      basic.isOpen.set(true);
      window.ng.applyChanges(basic);
    }
  });

  await new Promise(r => setTimeout(r, 150));
}

/**
 * Populate code input digits so the screenshot shows actual numbers instead
 * of empty boxes. The "disabled" example stays empty to keep the disabled
 * affordance visible.
 */
async function fillCodeInputs(page, section) {
  await section.evaluate(el => {
    const inputs = el.querySelectorAll('ea-code-input');
    // basic, error, sm, md, lg, 4-digit PIN, disabled
    const values = ['123456', '246810', '135791', '246802', '975312', '4826', ''];
    inputs.forEach((input, i) => {
      const component = window.ng?.getComponent?.(input);
      if (component?.value?.set && values[i] !== undefined) {
        component.value.set(values[i]);
        window.ng.applyChanges(component);
      }
    });
  });
  await new Promise(r => setTimeout(r, 100));
}

/**
 * Hide the "Open Dialog" trigger button and render the dialog inline as a
 * card within the section. Setting the `open` attribute directly on the
 * native <dialog> element displays it without entering the top layer (unlike
 * showModal()), so the screenshot can actually capture it.
 */
async function showDialogInline(page, section) {
  await page.addStyleTag({
    content: `
      .sandbox-section ea-dialog > .ea-dialog {
        position: static !important;
        display: block !important;
        width: fit-content !important;
        max-width: 100% !important;
        margin: 0 auto !important;
      }
    `,
  });

  await section.evaluate(el => {
    // Hide the "Open Dialog" trigger button (the first ea-button in the section)
    const trigger = el.querySelector('ea-button');
    if (trigger instanceof HTMLElement) {
      trigger.style.display = 'none';
    }

    // Set the `open` attribute directly on the native <dialog> element
    const dialog = el.querySelector('ea-dialog .ea-dialog');
    if (dialog instanceof HTMLElement) {
      dialog.setAttribute('open', '');
    }
  });

  await new Promise(r => setTimeout(r, 150));
}

/**
 * Render all four drawer variants inside a 2x2 grid of mock "windows" so each
 * screenshot conveys which edge the drawer enters from. The mock window acts
 * as a fake viewport: the drawer's <dialog> becomes absolutely positioned to
 * fill the mock, and the panel's natural edge positioning (top/left/bottom/
 * right) then anchors to the mock's containing block instead of the real
 * viewport.
 */
async function showDrawersInline(page, section) {
  await page.addStyleTag({
    content: `
      .sandbox-section .drawer-mock-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 8px;
      }
      .sandbox-section .drawer-mock-window {
        position: relative;
        height: 220px;
        overflow: hidden;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-md);
        background-color: var(--color-bg-muted);
      }
      .sandbox-section .drawer-mock-window ea-drawer {
        display: contents;
      }
      .sandbox-section .drawer-mock-window .ea-drawer {
        position: absolute !important;
        inset: 0 !important;
        width: auto !important;
        height: auto !important;
        max-width: none !important;
        max-height: none !important;
        background: transparent !important;
        overflow: hidden !important;
      }
      .sandbox-section .drawer-mock-window .ea-drawer__panel {
        max-width: none !important;
        max-height: none !important;
        box-shadow: var(--shadow-lg) !important;
      }
      .sandbox-section .drawer-mock-window .ea-drawer__panel--right,
      .sandbox-section .drawer-mock-window .ea-drawer__panel--left {
        width: 62% !important;
      }
      .sandbox-section .drawer-mock-window .ea-drawer__panel--top,
      .sandbox-section .drawer-mock-window .ea-drawer__panel--bottom {
        height: 58% !important;
      }
      .sandbox-section .drawer-mock-window .ea-drawer__header {
        padding: 12px 16px 4px !important;
        font-size: var(--font-size-md) !important;
      }
      .sandbox-section .drawer-mock-window .ea-drawer__body {
        padding: 4px 16px 12px !important;
        font-size: var(--font-size-xs) !important;
      }
      .sandbox-section .drawer-mock-window .ea-drawer__footer {
        display: none !important;
      }
    `,
  });

  await section.evaluate(el => {
    // Hide the row of trigger buttons
    const triggerRow = el.querySelector('.sandbox-row');
    if (triggerRow instanceof HTMLElement) {
      triggerRow.style.display = 'none';
    }

    // Wrap each <ea-drawer> in a mock window and arrange them in a 2x2 grid.
    const drawers = [...el.querySelectorAll('ea-drawer')];
    const grid = document.createElement('div');
    grid.className = 'drawer-mock-grid';

    for (const drawer of drawers) {
      const mock = document.createElement('div');
      mock.className = 'drawer-mock-window';
      mock.appendChild(drawer);
      grid.appendChild(mock);
    }

    el.appendChild(grid);

    // Open each drawer by setting the `open` attribute directly on its
    // native <dialog> element (bypasses showModal and the top layer).
    drawers.forEach(d => {
      const dialog = d.querySelector('.ea-drawer');
      if (dialog instanceof HTMLElement) {
        dialog.setAttribute('open', '');
      }
    });
  });

  await new Promise(r => setTimeout(r, 200));
}

/**
 * Open both the "basic" and "min & max" date-pickers so the screenshot shows a
 * plain selected-day state on top and a min/max-bounded calendar below with
 * out-of-range days disabled. Force each popover to flow inline below its
 * trigger at its natural content width — the default absolute positioning
 * would either overlap the next field or get clipped by the section's bounds,
 * and leaving it as a static block would stretch it to the full trigger width
 * instead of sitting at its natural ~18rem width.
 */
async function openDatePickerCalendar(page, section) {
  await page.addStyleTag({
    content: `
      .sandbox-section .ea-date-picker__popover {
        position: static !important;
        width: max-content !important;
        margin-top: 4px !important;
      }
    `,
  });

  await section.evaluate(el => {
    const pickers = el.querySelectorAll('ea-date-picker');
    // Order in the section: basic, with-hint, with-error, short, medium, long,
    // min/max, sm, md, lg, disabled.
    const basic = window.ng?.getComponent?.(pickers[0]);
    if (basic?.isOpen?.set) {
      const selected = new Date(basic.viewYear(), basic.viewMonth(), 15);
      basic.value.set(selected);
      basic.focusedDate.set(selected);
      basic.isOpen.set(true);
      window.ng.applyChanges(basic);
    }

    const minMax = window.ng?.getComponent?.(pickers[6]);
    if (minMax?.isOpen?.set) {
      minMax.focusedDate.set(new Date());
      minMax.isOpen.set(true);
      window.ng.applyChanges(minMax);
    }
  });

  await new Promise(r => setTimeout(r, 150));
}

/**
 * Open only the basic dropdown so its menu is visible. Leave the remaining
 * variants closed to keep the hint/error/size/disabled affordances readable.
 * Also hide the "Selected: {value}" preview text below the basic dropdown,
 * which is dev-only noise that doesn't belong in the README screenshot. The
 * absolute-positioned menu is overridden to flow inline so it doesn't overlap
 * the next field.
 */
async function openDropdownMenus(page, section) {
  await page.addStyleTag({
    content: `
      .sandbox-section .ea-dropdown__menu {
        position: static !important;
        max-height: none !important;
        margin-top: 4px !important;
      }
    `,
  });

  await section.evaluate(el => {
    const dropdowns = el.querySelectorAll('ea-dropdown');
    const basic = window.ng?.getComponent?.(dropdowns[0]);
    if (basic?.isOpen?.set) {
      basic.isOpen.set(true);
      window.ng.applyChanges(basic);
    }
  });

  await new Promise(r => setTimeout(r, 150));
}

/**
 * The indeterminate progress bar animates its fill from off-screen left to
 * off-screen right. A raw screenshot tends to catch it before the bar is
 * visible. Pause the animation mid-cycle so the blue fill sits clearly
 * inside the track.
 */
async function pauseIndeterminateProgress(page) {
  await page.addStyleTag({
    content: `
      .sandbox-section .ea-progress-bar--indeterminate .ea-progress-bar__fill {
        animation-delay: -0.75s !important;
        animation-play-state: paused !important;
      }
    `,
  });
  await new Promise(r => setTimeout(r, 100));
}

/**
 * Force every tooltip-annotated button in the section to show its tooltip by
 * dispatching a mouseenter event. Each TooltipDirective instance appends its
 * tooltip element to document.body at an absolute position, so the section's
 * bounding-box screenshot captures any tooltips that visually overlap it —
 * the sandbox tooltip grid cells are padded so each tooltip fits inside its
 * cell.
 */
async function showTooltips(page, section) {
  await section.evaluate(el => {
    const triggers = el.querySelectorAll('[eaTooltip]');
    triggers.forEach(t => {
      t.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });
  });
  await new Promise(r => setTimeout(r, 150));
}

const args = process.argv.slice(2);
const forceIdx = args.indexOf('--force');
const forceAll = forceIdx !== -1 && forceIdx === args.length - 1;
const forceNames = new Set(forceIdx !== -1 ? args.slice(forceIdx + 1) : []);

function shouldCapture(outPath, name) {
  if (forceAll || forceNames.has(name)) return true;
  return !existsSync(outPath);
}

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
if (!existsSync(ICONS_OUT)) mkdirSync(ICONS_OUT, { recursive: true });

async function waitForServer(timeout = 120_000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(URL);
      if (res.ok) return;
    } catch {
      /* not ready */
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Sandbox did not start within ${timeout / 1000}s`);
}

function findSection(heading) {
  const detailsEls = document.querySelectorAll('.sandbox-details');
  for (const d of detailsEls) {
    const summary = d.querySelector('.sandbox-summary');
    if (summary && summary.textContent.trim() === heading) {
      d.open = true;
      return d.querySelector('.sandbox-section');
    }
  }
  return null;
}

/**
 * Extract the SVG markup from an icon component file's inline template.
 */
function extractSvg(filePath) {
  const src = readFileSync(filePath, 'utf-8');
  const match = src.match(/template:\s*`([\s\S]*?)`/);
  return match ? match[1].trim() : null;
}

async function captureIcons(browser) {
  console.log('\nCapturing icon screenshots…');
  const page = await browser.newPage();
  await page.setViewport({ width: 96, height: 96, deviceScaleFactor: 2 });

  const files = readdirSync(ICONS_SRC).filter(f => f.endsWith('.component.ts'));
  let captured = 0;
  let skipped = 0;

  for (const file of files) {
    const name = file.replace('.component.ts', '');
    const outPath = resolve(ICONS_OUT, `${name}.png`);
    if (!shouldCapture(outPath, name)) {
      skipped++;
      continue;
    }

    const svg = extractSvg(resolve(ICONS_SRC, file));
    if (!svg) {
      console.warn(`  skip  ${name} (no SVG template found)`);
      continue;
    }

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 96px;
              height: 96px;
              background: transparent;
              color: #1a1a1a;
            }
            svg { width: 48px; height: 48px; }
          </style>
        </head>
        <body>${svg}</body>
      </html>
    `);

    await page.screenshot({ path: outPath, omitBackground: true });
    console.log(`  done  icons/${name}.png`);
    captured++;
  }

  await page.close();
  console.log(
    `\n${captured} icon screenshots captured` +
      (skipped ? `, ${skipped} already existed (use --force to overwrite).` : '.'),
  );
}

/**
 * Capture the README header image by screenshotting the large
 * `ea-eagami-wordmark` instance tagged with `.sandbox-readme-header-wordmark`
 * inside the Eagami Wordmark sandbox section. Expands the collapsible section
 * first so the target element is laid out, then screenshots just that element
 * with a transparent background.
 */
async function captureHeader(page) {
  const outPath = resolve(OUT, 'eagami-header.png');
  if (!shouldCapture(outPath, 'eagami-header')) {
    console.log(
      '\nHeader image already exists (use --force eagami-header to overwrite).',
    );
    return;
  }

  console.log('\nCapturing README header image…');

  // The wordmark at size="lg" with the long "eagami design system" text is
  // wider than the default sandbox details panel (max-width 600px), so bump
  // the viewport and lift the panel's width cap for this one section so the
  // wordmark lays out at its full content width without clipping or wrapping.
  await page.setViewport({ width: 2000, height: 600, deviceScaleFactor: 2 });
  await page.addStyleTag({
    content: `
      sandbox-root { max-width: none !important; }
      .sandbox-details:has(.sandbox-readme-header-wordmark) {
        max-width: none !important;
      }
    `,
  });

  const handle = await page.evaluateHandle(() => {
    const detailsEls = document.querySelectorAll('.sandbox-details');
    for (const d of detailsEls) {
      const summary = d.querySelector('.sandbox-summary');
      if (summary && summary.textContent.trim() === 'Eagami Wordmark') {
        d.open = true;
        return d.querySelector('.sandbox-readme-header-wordmark');
      }
    }
    return null;
  });
  const el = handle.asElement();
  if (!el) {
    console.warn('  skip  eagami-header (wordmark target not found)');
    return;
  }

  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 200));

  await el.screenshot({ path: outPath, omitBackground: true });
  console.log('  done  eagami-header.png');
}

async function main() {
  const puppeteer = await import('puppeteer');

  console.log('Starting sandbox dev server…');
  const server = spawn('npx', ['ng', 'serve', 'sandbox', '--port', String(PORT)], {
    cwd: ROOT,
    stdio: 'ignore',
    detached: true,
  });

  try {
    await waitForServer();
    console.log('Sandbox ready.\n');

    const browser = await puppeteer.default.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);
    await page.goto(URL, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);

    let captured = 0;
    let skipped = 0;
    for (const { name, heading, prepare } of SECTIONS) {
      const outPath = resolve(OUT, `${name}.png`);
      if (!shouldCapture(outPath, name)) {
        skipped++;
        continue;
      }
      const handle = await page.evaluateHandle(findSection, heading);
      const el = handle.asElement();
      if (!el) {
        console.warn(`  skip  ${name} (section not found)`);
        continue;
      }
      if (prepare) {
        await prepare(page, el);
      }
      await el.screenshot({ path: outPath });
      console.log(`  done  ${name}.png`);
      captured++;
    }

    console.log(
      `\n${captured} component screenshots captured` +
        (skipped ? `, ${skipped} already existed (use --force to overwrite).` : '.'),
    );

    await captureIcons(browser);

    await captureHeader(page);

    await browser.close();
  } finally {
    try {
      process.kill(-server.pid, 'SIGTERM');
    } catch {
      server.kill('SIGTERM');
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
