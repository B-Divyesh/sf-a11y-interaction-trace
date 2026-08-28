import AxeBuilder from '@axe-core/playwright';
import { existsSync, statSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

const expectedTitles: Record<string, string> = {
  '/': 'A11y Interaction Trace — record keyboard focus bugs',
  '/demo/': 'Demo — A11y Interaction Trace',
  '/privacy/': 'Privacy — A11y Interaction Trace',
  '/terms/': 'Terms — A11y Interaction Trace',
  '/lab/': 'Focus containment lab — A11y Interaction Trace',
  '/404.html': 'Page not found — A11y Interaction Trace'
};

async function withBuiltSiteServer(run: (origin: string) => Promise<void>) {
  const siteRoot = resolve('dist/site');
  const server = createServer((request, response) => {
    const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
    const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const requested = resolve(siteRoot, relativePath);
    const isInsideBuild = requested === siteRoot || requested.startsWith(`${siteRoot}/`);
    const found = isInsideBuild && existsSync(requested) && statSync(requested).isFile();
    const file = found ? requested : resolve(siteRoot, '404.html');
    void readFile(file).then(body => {
      response.statusCode = found ? 200 : 404;
      response.setHeader('Content-Type', file.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream');
      response.end(body);
    }).catch(() => {
      response.statusCode = 500;
      response.end('Could not read the built site.');
    });
  });
  await new Promise<void>(resolveServer => server.listen(0, '127.0.0.1', resolveServer));
  const address = server.address() as AddressInfo;
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolveServer, rejectServer) => server.close(error => error ? rejectServer(error) : resolveServer()));
  }
}

for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/lab/', '/404.html']) {
  test(`${path} has semantic structure and no serious axe findings`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(expectedTitles[path]!);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(path === '/404.html' ? 0 : 1);
    for (const selector of ['meta[name="description"]', 'meta[name="theme-color"]', 'meta[property="og:title"]', 'meta[property="og:image"]', 'meta[name="twitter:card"]', 'link[rel="apple-touch-icon"]']) await expect(page.locator(selector)).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('@claim:seeded-focus-defect seeded focus defect is reproducible and Escape restores focus', async ({ page }) => {
  await page.goto('/lab/');
  await page.getByRole('button', { name: 'Open quick edit' }).click();
  await expect(page.locator('#project-name')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('link', { name: 'Background help' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open quick edit' })).toBeFocused();
});

test('route navigation and Back focus and announce the new h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip')).toBeFocused();
  await page.getByRole('link', { name: 'Demo', exact: true }).first().click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.locator('h1')).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('See where keyboard focus escaped.');
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('h1')).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Record keyboard focus failures for your team.');
});

test('390px first screen identifies job, audience, action, and three facts without clipping', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('For web developers and accessibility testers', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.locator('.hero-facts li')).toHaveCount(3);
  const action = await page.getByRole('link', { name: 'Try it with sample data' }).boundingBox();
  expect(action).not.toBeNull();
  expect(action!.y + action!.height).toBeLessThanOrEqual(844);
  const lastFact = await page.locator('.hero-facts li').last().boundingBox();
  expect(lastFact!.y + lastFact!.height).toBeLessThanOrEqual(844);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test('1440px first screen identifies job, audience, action, outcome, and facts without scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const required = [
    page.getByRole('heading', { level: 1 }),
    page.getByText('For web developers and accessibility testers', { exact: false }),
    page.getByRole('link', { name: 'Try it with sample data' }),
    page.getByText('Opens a checkout dialog with a completed sample trace.', { exact: false }),
    page.locator('.hero-facts li').last()
  ];
  for (const item of required) {
    await expect(item).toBeVisible();
    const box = await item.boundingBox();
    expect(box, 'required first-screen element has a box').not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(900);
  }
});

test('visible mobile links and buttons provide at least 44px targets', async ({ page }) => {
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/lab/', '/404.html']) {
    await page.goto(path);
    for (const element of await page.locator('a:visible, button:visible, input:visible').all()) {
      const box = await element.boundingBox();
      expect(box?.height ?? 0, `${path}: ${await element.evaluate(node => node.outerHTML.slice(0, 100))}`).toBeGreaterThanOrEqual(44);
      expect(box?.width ?? 0, `${path}: ${await element.evaluate(node => node.outerHTML.slice(0, 100))}`).toBeGreaterThanOrEqual(44);
    }
  }
});

test('@claim:designed-404 unknown built-site paths return the styled 404 page and a working return link', async ({ browser }) => {
  const config = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8')) as { responseOverrides?: { '404'?: { rewrite?: string; statusCode?: number } } };
  expect(config.responseOverrides?.['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  await withBuiltSiteServer(async origin => {
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      const response = await page.goto(`${origin}/recording-does-not-exist`);
      expect(response?.status()).toBe(404);
      await expect(page).toHaveTitle('Page not found — A11y Interaction Trace');
      await expect(page.getByRole('heading', { level: 1, name: 'This path has no recorded step.' })).toBeVisible();
      const returnLink = page.getByRole('link', { name: 'Return to product' });
      await expect(returnLink).toHaveAttribute('href', '/');
      await Promise.all([page.waitForNavigation(), returnLink.click()]);
      await expect(page).toHaveURL(`${origin}/`);
      await expect(page.getByRole('heading', { level: 1, name: 'Record keyboard focus failures for your team.' })).toBeVisible();
    } finally {
      await context.close();
    }
  });
});

test('@claim:offline-site every visited public page and the interactive demo remain available offline', async ({ browser }) => {
  const routes = [
    { path: '/', heading: 'Record keyboard focus failures for your team.' },
    { path: '/demo/', heading: 'See where keyboard focus escaped.' },
    { path: '/lab/', heading: 'Reproduce a focus escape.' },
    { path: '/privacy/', heading: 'Privacy stays on your machine.' },
    { path: '/terms/', heading: 'Use the trace responsibly.' }
  ];
  const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4174';
  const allowedOrigin = new URL(baseURL).origin;

  for (const route of routes) {
    const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const requests: string[] = [];
    const runtimeErrors: string[] = [];
    page.on('request', request => requests.push(request.url()));
    page.on('requestfailed', request => runtimeErrors.push(`${request.url()}: ${request.failure()?.errorText ?? 'request failed'}`));
    page.on('pageerror', error => runtimeErrors.push(error.message));

    await page.goto(route.path);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    const offlineReady = await page.evaluate(() => new Promise<{ cache: string; resources: string[] }>((resolve, reject) => {
      const channel = new MessageChannel();
      const timeout = window.setTimeout(() => reject(new Error('Service worker did not confirm offline readiness.')), 5000);
      channel.port1.onmessage = event => {
        window.clearTimeout(timeout);
        resolve(event.data);
      };
      navigator.serviceWorker.controller!.postMessage({ type: 'OFFLINE_READY' }, [channel.port2]);
    }));
    const requiredResources = await page.locator('script[src], link[rel="stylesheet"], link[rel="modulepreload"]').evaluateAll(elements => elements.map(element => new URL((element as HTMLScriptElement).src || (element as HTMLLinkElement).href).pathname));
    expect(offlineReady.cache).toBe('a11y-trace-site-v9');
    expect(offlineReady.resources).toEqual(expect.arrayContaining([route.path, ...requiredResources]));
    const originalDemoState = route.path === '/demo/'
      ? await page.evaluate(() => localStorage.getItem('demo:a11y-interaction-trace:state'))
      : null;

    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(route.heading);
    const offlineState = await page.evaluate(async resources => ({
      controlled: Boolean(navigator.serviceWorker.controller),
      cacheMatches: await Promise.all(resources.map(async resource => Boolean(await caches.match(resource, { ignoreVary: true })))),
      fetches: await Promise.all(resources.map(async resource => fetch(resource).then(response => response.ok).catch(() => false)))
    }), requiredResources);
    expect(offlineState, `${route.path} lost its service-worker cache`).toEqual({ controlled: true, cacheMatches: requiredResources.map(() => true), fetches: requiredResources.map(() => true) });
    expect(runtimeErrors, `${route.path} logged an offline runtime error`).toEqual([]);

    if (route.path === '/demo/') {
      expect(originalDemoState).toBeTruthy();
      await page.getByRole('button', { name: 'Replay sample' }).click();
      await expect(page.locator('#demo-status')).toContainText('Replay complete');
      expect(await page.evaluate(() => localStorage.getItem('demo:a11y-interaction-trace:state'))).not.toBe(originalDemoState);
      await page.getByRole('button', { name: 'Reset demo' }).click();
      await expect(page.locator('#demo-status')).toContainText('Demo reset to the original four events');
      expect(await page.evaluate(() => localStorage.getItem('demo:a11y-interaction-trace:state'))).toBe(originalDemoState);
    }

    expect(requests.every(request => new URL(request).origin === allowedOrigin), `${route.path} made a third-party request`).toBe(true);
    await context.close();
  }
});
