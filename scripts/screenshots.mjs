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
  { name: 'data-table', heading: 'Data Table' },
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
  const sections = document.querySelectorAll('.sandbox-section');
  for (const section of sections) {
    const h2 = section.querySelector('h2');
    if (h2 && h2.textContent.includes(heading)) return section;
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
    for (const { name, heading } of SECTIONS) {
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
      await el.screenshot({ path: outPath });
      console.log(`  done  ${name}.png`);
      captured++;
    }

    console.log(
      `\n${captured} component screenshots captured` +
        (skipped ? `, ${skipped} already existed (use --force to overwrite).` : '.'),
    );

    await captureIcons(browser);

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
