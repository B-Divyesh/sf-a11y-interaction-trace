import { chromium, type BrowserContext, type Page, type Worker } from 'playwright';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export type ExtensionHarness = { context: BrowserContext; lab: Page; popup: Page; worker: Worker };

export async function withExtension(run: (harness: ExtensionHarness) => Promise<void>, fixturePath = '/lab/') {
  const root = await mkdtemp(join(tmpdir(), 'a11y-trace-extension-'));
  const extensionDir = join(root, 'extension');
  const profileDir = join(root, 'profile');
  await cp('.output/chrome-mv3', extensionDir, { recursive: true });
  const manifestPath = join(extensionDir, 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as Record<string, unknown>;
  // The temporary host grant replaces the toolbar gesture that automation cannot synthesize.
  // It is added only to the copied harness manifest; the shipped manifest is checked separately.
  manifest.host_permissions = ['<all_urls>'];
  await writeFile(manifestPath, JSON.stringify(manifest));
  const context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionDir}`, `--load-extension=${extensionDir}`]
  });
  try {
    const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const lab = context.pages()[0] ?? await context.newPage();
    await lab.goto(`http://127.0.0.1:4173${fixturePath}`);
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await run({ context, lab, popup, worker });
  } finally {
    await context.close();
    await rm(root, { recursive: true, force: true });
  }
}
