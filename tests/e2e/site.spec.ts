import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const expectedTitles: Record<string, string> = {
  '/': 'A11y Interaction Trace — record keyboard focus bugs',
  '/demo/': 'Demo — A11y Interaction Trace',
  '/privacy/': 'Privacy — A11y Interaction Trace',
  '/terms/': 'Terms — A11y Interaction Trace',
  '/lab/': 'Focus containment lab — A11y Interaction Trace',
  '/404.html': 'Page not found — A11y Interaction Trace'
};

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

test('static host maps unknown paths to the designed 404 response', async () => {
  const config = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8')) as { responseOverrides?: { '404'?: { rewrite?: string; statusCode?: number } } };
  expect(config.responseOverrides?.['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  const page404 = await readFile('site/404.html', 'utf8');
  expect(page404).toContain('<title>Page not found — A11y Interaction Trace</title>');
  expect(page404).toContain('Return to product');
});

test('@claim:offline-site the visited landing page remains available offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Record keyboard focus failures');
});
