import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { buildViewerHtml } from '../../src/lib/export';
import type { TraceSession } from '../../src/lib/types';
import { withExtension } from './extension-harness';

const sample: TraceSession = {
  schema: 1, id: 'claim', status: 'stopped', startedAt: '2026-08-28T12:00:00.000Z', endedAt: '2026-08-28T12:00:02.180Z',
  tabId: 1, windowId: 1, url: 'https://shop.example.test/settings/checkout', title: 'Checkout settings',
  viewport: { width: 1280, height: 720, devicePixelRatio: 1 }, userAgent: 'claim browser', screenshotsEnabled: false,
  events: [
    { id: 'start', at: 0, kind: 'start', action: 'Recording started' },
    { id: 'enter', at: 240, kind: 'keyboard', action: 'Enter', focus: { tag: 'input', role: 'textbox', name: 'Project name', selector: '#project-name', states: ['inside dialog'], focused: true }, snapshot: { scope: '#dialog', nodes: [{ tag: 'input', role: 'textbox', name: 'Project name', selector: '#project-name', states: ['inside dialog'], focused: true }] } },
    { id: 'shift-tab', at: 1420, kind: 'keyboard', action: 'Shift+Tab', focus: { tag: 'a', role: 'link', name: 'Background help', selector: '#background-help', states: ['outside dialog'], focused: true } },
    { id: 'escape', at: 2180, kind: 'keyboard', action: 'Escape', focus: { tag: 'button', role: 'button', name: 'Open quick edit', selector: '#open-dialog', states: ['dialog closed'], focused: true } }
  ]
};

test('@claim:demo-isolation demo uses only its namespace and reset preserves real data', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { localStorage.setItem('real:sentinel', 'keep'); localStorage.setItem('traceSession', 'real-trace'); });
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByRole('button', { name: 'Replay sample' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const storage = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
  expect(storage['real:sentinel']).toBe('keep');
  expect(storage.traceSession).toBe('real-trace');
  expect(Object.keys(storage).filter(key => key.startsWith('demo:'))).toEqual(['demo:a11y-interaction-trace:state']);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/#install$/);
  const afterExit = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
  expect(afterExit['real:sentinel']).toBe('keep');
  expect(afterExit.traceSession).toBe('real-trace');
  expect(Object.keys(afterExit).filter(key => key.startsWith('demo:'))).toEqual([]);
});

test('@claim:trace-export-content sample export contains actions, focus, page details, and nearby control snapshots', async ({ page }) => {
  await page.goto('/demo/');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download sample trace' }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  const html = await readFile(path!, 'utf8');
  for (const value of ['Checkout settings', 'Enter', 'Shift+Tab', 'Escape', 'Project name', 'Background help', 'Nearby control snapshot']) expect(html).toContain(value);
  expect(download.suggestedFilename()).toBe('a11y-trace-sample-checkout.html');
});

test('@claim:chronological-order sample events and exported events stay in timestamp order', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.locator('#demo-events h3')).toHaveText(['Recording started', 'Enter', 'Shift + Tab', 'Escape']);
  const times = await page.locator('#demo-events .trace-top code').allTextContents();
  expect(times).toEqual(['+0.00 s', '+0.24 s', '+1.42 s', '+2.18 s']);
  expect(sample.events.map(event => event.at)).toEqual([0, 240, 1420, 2180]);
});

test('@claim:explicit-recording recorder starts only on request and exposes both recording indicators', async () => {
  await withExtension(async ({ lab, popup, worker }) => {
    await expect(lab.locator('#__a11y_trace_recorder__')).toHaveCount(0);
    await lab.bringToFront();
    await popup.evaluate(() => document.querySelector<HTMLButtonElement>('#start')!.click());
    await expect(lab.locator('#__a11y_trace_recorder__')).toContainText('TRACE REC');
    await expect(lab.locator('#__a11y_trace_recorder__').getByRole('button', { name: 'Stop' })).toBeVisible();
    await expect.poll(() => worker.evaluate(() => chrome.action.getBadgeText({}))).toBe('REC');
    await lab.locator('#__a11y_trace_recorder__').getByRole('button', { name: 'Stop' }).click();
    await expect(lab.locator('#__a11y_trace_recorder__')).toHaveCount(0);
    await expect.poll(() => worker.evaluate(() => chrome.action.getBadgeText({}))).toBe('');
    await lab.bringToFront();
    await popup.evaluate(() => document.querySelector<HTMLButtonElement>('#start')!.click());
    await expect(lab.locator('#__a11y_trace_recorder__')).toBeVisible();
    await popup.evaluate(() => document.querySelector<HTMLButtonElement>('#stop')!.click());
    await expect(lab.locator('#__a11y_trace_recorder__')).toHaveCount(0);
  });
});

test('@claim:key-privacy stored and exported traces replace typed characters but retain navigation keys', async () => {
  await withExtension(async ({ lab, popup, worker }) => {
    await lab.bringToFront();
    await popup.evaluate(() => chrome.runtime.sendMessage({ type: 'START_SESSION', screenshotsEnabled: false }));
    await lab.locator('#open-dialog').focus();
    await lab.keyboard.press('x');
    await lab.keyboard.press('Shift+Tab');
    await expect.poll(async () => {
      const stored = await worker.evaluate(() => chrome.storage.local.get('traceSession')) as { traceSession?: TraceSession };
      return stored.traceSession?.events.filter(event => event.kind === 'keyboard').length ?? 0;
    }).toBe(2);
    const stored = await worker.evaluate(() => chrome.storage.local.get('traceSession')) as { traceSession?: TraceSession };
    const actions = stored.traceSession!.events.filter(event => event.kind === 'keyboard').map(event => event.action);
    expect(actions).toEqual(['Character', 'Shift+Tab']);
    const html = buildViewerHtml(stored.traceSession!);
    expect(html).toContain('Character');
    expect(html).toContain('Shift+Tab');
    expect(html).not.toContain('>x<');
  });
});

test('@claim:sensitive-mask password, payment, one-time-code, and marked fields are absent from the trace and masked in screenshots', async () => {
  await withExtension(async ({ lab, popup, worker }) => {
    await lab.setViewportSize({ width: 700, height: 700 });
    const labels = ['Password', 'Card number', 'One-time code', 'Private account note'];
    const secrets = ['SENSITIVE-PASSWORD-8472', '4111111111111111', '739204', 'SENSITIVE-PRIVATE-NOTE-8472'];
    const boxes = [];
    for (const label of labels) boxes.push(await lab.getByLabel(label).boundingBox());
    expect(boxes.every(Boolean)).toBe(true);
    await lab.bringToFront();
    await popup.evaluate(() => chrome.runtime.sendMessage({ type: 'START_SESSION', screenshotsEnabled: true }));
    for (const label of labels) {
      await lab.getByLabel(label).focus();
      await lab.keyboard.press('z');
      await lab.waitForTimeout(700);
    }
    await expect.poll(async () => {
      const stored = await worker.evaluate(() => chrome.storage.local.get('traceSession')) as { traceSession?: TraceSession };
      return stored.traceSession?.events.filter(event => event.screenshot).length ?? 0;
    }).toBe(4);
    const stored = await worker.evaluate(() => chrome.storage.local.get('traceSession')) as { traceSession?: TraceSession };
    const serialized = JSON.stringify(stored.traceSession);
    for (const secret of secrets) expect(serialized).not.toContain(secret);
    expect(stored.traceSession!.events.filter(event => event.kind === 'keyboard').map(event => event.action)).toEqual([
      'Masked character', 'Masked character', 'Masked character', 'Masked character'
    ]);
    const screenshots = stored.traceSession!.events.filter(event => event.screenshot).map(event => event.screenshot!);
    for (let index = 0; index < screenshots.length; index += 1) {
      const box = boxes[index]!;
      const pixel = await lab.evaluate(async ({ dataUrl, x, y }) => {
        const image = new Image();
        image.src = dataUrl;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d')!;
        context.drawImage(image, 0, 0);
        return Array.from(context.getImageData(x, y, 1, 1).data);
      }, { dataUrl: screenshots[index]!, x: Math.round(box!.x + 8), y: Math.round(box!.y + box!.height / 2) });
      expect(pixel[0]).toBeLessThan(60);
      expect(pixel[1]).toBeLessThan(60);
      expect(pixel[2]).toBeLessThan(60);
    }
    const html = buildViewerHtml(stored.traceSession!);
    for (const secret of secrets) expect(html).not.toContain(secret);
  }, '/sensitive-fixture/');
});

test('@claim:screenshot-boundary screenshots default off and use visible-tab capture with a 12-image cap', async () => {
  await withExtension(async ({ context, lab, popup, worker }) => {
    await expect(popup.locator('#screenshots')).not.toBeChecked();
    await lab.evaluate(() => { document.body.style.background = 'rgb(17, 129, 67)'; });
    const background = await context.newPage();
    await background.goto('http://127.0.0.1:4173/lab/');
    await background.evaluate(() => { document.body.style.background = 'rgb(171, 35, 35)'; });
    await lab.bringToFront();
    await popup.evaluate(() => chrome.runtime.sendMessage({ type: 'START_SESSION', screenshotsEnabled: true }));
    for (let index = 0; index < 13; index += 1) {
      await lab.keyboard.press('a');
      await lab.waitForTimeout(700);
    }
    type Stored = { traceSession?: TraceSession };
    await expect.poll(async () => ((await worker.evaluate(() => chrome.storage.local.get('traceSession'))) as Stored).traceSession?.events.length ?? 0).toBeGreaterThanOrEqual(14);
    const stored = (await worker.evaluate(() => chrome.storage.local.get('traceSession'))) as Stored;
    const events = stored.traceSession?.events ?? [];
    expect(events.map(event => event.screenshot ? 'shot' : event.screenshotError ?? 'none')).toContain('shot');
    expect(events.filter(event => event.screenshot).length).toBe(12);
    expect(events.filter(event => event.screenshotError?.includes('12 captures')).length).toBe(1);
    expect(events.find(event => event.screenshot)?.screenshot).toMatch(/^data:image\/jpeg;base64,/);
    const screenshot = events.find(event => event.screenshot)!.screenshot!;
    const pixel = await lab.evaluate(async dataUrl => {
      const image = new Image();
      image.src = dataUrl;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0);
      return Array.from(context.getImageData(image.naturalWidth - 8, image.naturalHeight - 8, 1, 1).data);
    }, screenshot);
    expect(pixel[1]!).toBeGreaterThan(pixel[0]! * 2);
    expect(pixel[1]!).toBeGreaterThan(pixel[2]! * 1.4);
    await popup.evaluate(() => chrome.runtime.sendMessage({ type: 'STOP_SESSION' }));
  });
});

test('@claim:offline-export exported trace renders all fields without any network request', async ({ page, context }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await context.setOffline(true);
  await page.setContent(buildViewerHtml(sample));
  await expect(page.getByRole('heading', { name: 'Interaction trace' })).toBeVisible();
  await expect(page.getByText('Background help')).toBeVisible();
  await expect(page.locator('.notice')).toContainText('Nearby control snapshot');
  expect(requests).toEqual([]);
});

test('@claim:local-no-upload trace remains in extension storage, clears there, and makes no remote request', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', request => origins.add(new URL(request.url()).origin));
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Replay sample' }).click();
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
  await withExtension(async ({ context, lab, popup, worker }) => {
    const remoteRequests: string[] = [];
    context.on('request', request => {
      if (request.url().startsWith('http') && !request.url().startsWith('http://127.0.0.1:4173')) remoteRequests.push(request.url());
    });
    await lab.bringToFront();
    await popup.evaluate(() => chrome.runtime.sendMessage({ type: 'START_SESSION', screenshotsEnabled: false }));
    await lab.keyboard.press('Tab');
    await expect.poll(async () => Object.keys(await worker.evaluate(() => chrome.storage.local.get())).length).toBe(1);
    const stored = await worker.evaluate(() => chrome.storage.local.get()) as Record<string, unknown>;
    expect(stored.traceSession).toBeTruthy();
    await popup.evaluate(() => chrome.runtime.sendMessage({ type: 'CLEAR_SESSION' }));
    await expect.poll(async () => Object.keys(await worker.evaluate(() => chrome.storage.local.get())).length).toBe(0);
    expect(remoteRequests).toEqual([]);
  });
  const sources = await Promise.all(['entrypoints/background.ts', 'entrypoints/recorder.ts', 'entrypoints/popup/main.ts'].map(file => readFile(file, 'utf8')));
  expect(sources.join('\n')).not.toMatch(/fetch\(|XMLHttpRequest|sendBeacon|analytics|telemetry|oauth|signIn/i);
});

test('@claim:snapshot-scope UI and downloaded sample export identify accurate selected DOM details without claiming a full accessibility tree', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.locator('.scope-note')).toContainText('selected DOM roles, names, states, and focus');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download sample trace' }).click();
  const download = await downloadPromise;
  const html = await readFile((await download.path())!, 'utf8');
  expect(html).toContain('Nearby control snapshot');
  expect(html).toContain('not the browser or operating system’s accessibility tree');
  expect(html).not.toContain('narrowed semantic snapshot');
  const serialized = html.match(/<script type="application\/json" id="trace-data">([\s\S]*?)<\/script>/)?.[1];
  expect(serialized).toBeTruthy();
  const trace = JSON.parse(serialized!) as TraceSession;
  expect(trace.events.filter(event => event.focus).map(event => event.focus && ({ tag: event.focus.tag, role: event.focus.role, name: event.focus.name, selector: event.focus.selector }))).toEqual([
    { tag: 'input', role: 'textbox', name: 'Project name', selector: '#project-name' },
    { tag: 'a', role: 'link', name: 'Background help', selector: '#background-help' },
    { tag: 'button', role: 'button', name: 'Open quick edit', selector: '#open-dialog' }
  ]);
  expect(trace.events.filter(event => event.snapshot).map(event => event.snapshot!.nodes[0]!).map(node => ({ tag: node.tag, role: node.role, name: node.name, selector: node.selector }))).toEqual([
    { tag: 'input', role: 'textbox', name: 'Project name', selector: '#project-name' },
    { tag: 'a', role: 'link', name: 'Background help', selector: '#background-help' },
    { tag: 'button', role: 'button', name: 'Open quick edit', selector: '#open-dialog' }
  ]);
});

test('@claim:manifest-permissions built manifest has only four named permissions and no host permissions', async () => {
  const manifest = JSON.parse(await readFile('.output/chrome-mv3/manifest.json', 'utf8')) as { manifest_version: number; permissions: string[]; host_permissions?: string[] };
  expect(manifest.manifest_version).toBe(3);
  expect([...manifest.permissions].sort()).toEqual(['activeTab', 'downloads', 'scripting', 'storage']);
  expect(manifest.host_permissions ?? []).toEqual([]);
});

test('@claim:chromium-package production build emits a loadable Chromium MV3 package', async () => {
  const manifest = JSON.parse(await readFile('.output/chrome-mv3/manifest.json', 'utf8')) as { manifest_version: number; action?: unknown; background?: { service_worker?: string } };
  expect(manifest.manifest_version).toBe(3);
  expect(manifest.action).toBeTruthy();
  expect(manifest.background?.service_worker).toBeTruthy();
});

test('@claim:packaged-build production build creates every documented non-empty artifact', async () => {
  for (const path of ['.output/chrome-mv3/manifest.json', '.output/a11y-interaction-trace-1.0.0-chrome.zip', 'dist/site/index.html', 'dist/site/downloads/a11y-interaction-trace.zip']) {
    expect(existsSync(path), path).toBe(true);
    expect(statSync(path).size, path).toBeGreaterThan(0);
  }
});

test('@claim:free-mit repository carries the MIT grant and no billing integration', async ({ page }) => {
  const [license, packageJson] = await Promise.all([readFile('LICENSE', 'utf8'), readFile('package.json', 'utf8')]);
  expect(license).toContain('Permission is hereby granted, free of charge');
  expect(packageJson).not.toMatch(/stripe|dodo|billing/i);
  await page.goto('/');
  await expect(page.getByText('Free.', { exact: true })).toBeVisible();
});

test('@claim:provenance generated artwork and authored mark have documented local sources', async () => {
  const design = await readFile('.factory/design.md', 'utf8');
  expect(existsSync('assets/src/trace-slab.png')).toBe(true);
  expect(existsSync('assets/src/trace-slab.prompt.json')).toBe(true);
  expect(existsSync('public/trace-mark.svg')).toBe(true);
  expect(design).toContain('Provenance');
});
