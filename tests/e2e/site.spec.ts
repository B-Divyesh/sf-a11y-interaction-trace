import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

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
