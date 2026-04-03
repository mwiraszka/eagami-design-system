/* global process */
/**
 * Capture README component screenshots from the sandbox app.
 *
 * Starts the sandbox dev server, waits for it to be ready, then uses Puppeteer
 * to screenshot each `.sandbox-section` matched by its first <h2> text. Output
 * goes to docs/images/<name>.png at 2x resolution.
 *
 * Usage:
 *   pnpm screenshots
 *   node scripts/screenshots.mjs
 *
 * To add a new component screenshot:
 *   1. Add a sandbox section in sandbox.component.html
 *   2. Append an entry to the SECTIONS array below
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'docs/images');
const PORT = 4250;
const URL = `http://localhost:${PORT}`;
const VIEWPORT = { width: 640, height: 800, deviceScaleFactor: 2 };

/**
 * Each entry maps an output filename to the <h2> text that identifies
 * its `.sandbox-section`. The first section whose <h2> includes the
 * heading string wins.
 */
const SECTIONS = [
  { name: 'button', heading: 'Button' },
  { name: 'input', heading: 'Input' },
  { name: 'textarea', heading: 'Textarea' },
  { name: 'checkbox', heading: 'Checkbox' },
  { name: 'switch', heading: 'Switch' },
  { name: 'radio', heading: 'Radio' },
  { name: 'dropdown', heading: 'Dropdown' },
  { name: 'card', heading: 'Card' },
  { name: 'avatar', heading: 'Avatar —' },
  { name: 'avatar-editor', heading: 'Avatar Editor' },
  { name: 'progress-bar', heading: 'Progress Bar' },
  { name: 'tag', heading: 'Tag' },
  { name: 'badge', heading: 'Badge' },
  { name: 'spinner', heading: 'Spinner' },
  { name: 'divider', heading: 'Divider' },
  { name: 'dialog', heading: 'Dialog' },
  { name: 'tooltip', heading: 'Tooltip' },
  { name: 'toast', heading: 'Toast' },
  { name: 'code-input', heading: 'Code Input' },
  { name: 'tabs', heading: 'Tabs' },
  { name: 'alert', heading: 'Alert' },
  { name: 'skeleton', heading: 'Skeleton' },
  { name: 'accordion', heading: 'Accordion' },
];

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

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
  const sections = document.querySelectorAll('.sandbox-section');
  for (const section of sections) {
    const h2 = section.querySelector('h2');
    if (h2 && h2.textContent.includes(heading)) return section;
  }
  return null;
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
    for (const { name, heading } of SECTIONS) {
      const handle = await page.evaluateHandle(findSection, heading);
      const el = handle.asElement();
      if (!el) {
        console.warn(`  skip  ${name} (section not found)`);
        continue;
      }
      await el.screenshot({ path: resolve(OUT, `${name}.png`) });
      console.log(`  done  ${name}.png`);
      captured++;
    }

    await browser.close();
    console.log(`\n${captured}/${SECTIONS.length} screenshots captured.`);
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
