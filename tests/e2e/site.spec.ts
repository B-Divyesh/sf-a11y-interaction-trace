import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { buildViewerHtml } from '../../src/lib/export';

for (const path of ['/', '/privacy/', '/terms/', '/lab/']) {
  test(`${path} has semantic structure and no serious axe findings`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/A11y Interaction Trace|Focus containment lab/);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('seeded focus defect is reproducible and Escape restores focus', async ({ page }) => {
  await page.goto('/lab/');
  await page.getByRole('button', { name: 'Open quick edit' }).click();
  await expect(page.locator('#project-name')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('link', { name: 'Background help' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open quick edit' })).toBeFocused();
});

test('the visited landing page remains available offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Make focus failures visible');
});

test('an ARIA-labelled password-like text field is masked in the captured JPEG and offline viewer', async ({ page }) => {
  const secret = 'SENSITIVE-ARIA-PASSWORD-8472';
  await page.setViewportSize({ width: 700, height: 500 });
  await page.goto('/sensitive-fixture/');
  const input = page.getByLabel('Password');
  const box = await input.boundingBox();
  expect(box).not.toBeNull();

  await page.evaluate(() => {
    (window as typeof window & { tracePrivacyFixture: { mask(): void } }).tracePrivacyFixture.mask();
  });
  await expect(page.locator('#__a11y_trace_masks__')).toHaveCount(1);
  const jpeg = await page.screenshot({ type: 'jpeg', quality: 70 });
  const screenshot = `data:image/jpeg;base64,${jpeg.toString('base64')}`;

  const maskPixel = await page.evaluate(async ({ dataUrl, x, y }) => {
    const image = new Image();
    image.src = dataUrl;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    return Array.from(context.getImageData(x, y, 1, 1).data);
  }, { dataUrl: screenshot, x: Math.round(box!.x + 8), y: Math.round(box!.y + box!.height / 2) });
  expect(maskPixel[0]).toBeLessThan(60);
  expect(maskPixel[1]).toBeLessThan(60);
  expect(maskPixel[2]).toBeLessThan(60);

  const viewer = buildViewerHtml({
    schema: 1,
    id: 'privacy-regression',
    status: 'stopped',
    startedAt: '2026-08-28T00:00:00.000Z',
    endedAt: '2026-08-28T00:00:01.000Z',
    tabId: 1,
    windowId: 1,
    url: 'https://example.test/account',
    title: 'Account preferences',
    viewport: { width: 700, height: 500, devicePixelRatio: 1 },
    userAgent: 'privacy regression',
    screenshotsEnabled: true,
    events: [{ id: 'capture', at: 500, kind: 'keyboard', action: 'Masked character', screenshot }]
  });
  expect(viewer).not.toContain(secret);
  await page.goto(`data:text/html;charset=utf-8,${encodeURIComponent(viewer)}`);
  await expect(page.getByRole('img', { name: /visible page/i })).toHaveCount(1);
  await expect(page.locator('body')).not.toContainText(secret);
});
