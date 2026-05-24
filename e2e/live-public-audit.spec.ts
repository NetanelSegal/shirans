import { test, expect } from '@playwright/test';

const AUTH_API = `${process.env.PLAYWRIGHT_SERVER_URL || 'http://localhost:3000'}/api/auth`;
const E2E_ADMIN_EMAIL = 'e2e-admin@example.com';
const E2E_ADMIN_PASSWORD = 'Admin123!';

async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const response = await page.request.post(`${AUTH_API}/login`, {
    data: { email: E2E_ADMIN_EMAIL, password: E2E_ADMIN_PASSWORD },
  });
  if (!response.ok()) {
    throw new Error(`Admin login failed: ${response.status()}`);
  }
  const body = await response.json();
  await page.evaluate((token: string) => {
    localStorage.setItem('accessToken', token);
  }, body.accessToken);
}

test.describe('Live browser audit — public + admin media', () => {
  test('API returns media[] shape', async ({ request }) => {
    const res = await request.get(
      `${process.env.PLAYWRIGHT_SERVER_URL || 'http://localhost:3000'}/api/projects`,
    );
    expect(res.ok()).toBeTruthy();
    const projects = await res.json();
    expect(Array.isArray(projects)).toBeTruthy();
    if (projects.length > 0) {
      expect(projects[0]).toHaveProperty('media');
      expect(Array.isArray(projects[0].media)).toBeTruthy();
      expect(projects[0].media[0]).toMatchObject({
        id: expect.any(String),
        url: expect.any(String),
        type: expect.any(String),
        order: expect.any(Number),
      });
    }
  });

  test('desktop: home, projects list, project detail', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      if (text.includes('favicon')) return;
      if (text.includes('Encountered two children with the same key')) return;
      consoleErrors.push(text);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/שירן גלעד/);

    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'פרוייקטים' })).toBeVisible();
    await expect(page.locator('a[href^="/projects/"] img').first()).toBeVisible();

    const firstLink = page.locator('a[href^="/projects/"]').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toBeTruthy();
    await firstLink.click();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.breakout-x-padding img').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'תמונות' })).toBeVisible();

    expect(consoleErrors.filter((e) => !e.includes('favicon'))).toEqual([]);
  });

  test('mobile: projects list and detail layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('a[href^="/projects/"] img').first()).toBeVisible();

    await page.locator('a[href^="/projects/"]').first().click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'תמונות' })).toBeVisible();
    await expect(page.locator('.breakout-x-padding img').first()).toBeVisible();
  });

  test('admin: row toggle loading + images modal sections', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/projects', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByRole('heading', { name: 'ניהול פרויקטים' }),
    ).toBeVisible({ timeout: 20_000 });

    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    const completedButton = firstRow.getByRole('button', {
      name: /סמן כהושלם|סמן כלא הושלם/,
    });
    const completedLabelBefore = await completedButton.getAttribute('aria-label');

    const updatePromise = page.waitForResponse(
      (res) =>
        res.url().includes('/api/projects') &&
        res.request().method() === 'PUT' &&
        res.ok(),
    );

    await completedButton.click();
    await updatePromise;

    await expect(completedButton).not.toHaveAttribute(
      'aria-label',
      completedLabelBefore ?? '',
    );

    const imagesButton = firstRow.getByRole('button', { name: /^תמונות / });
    await imagesButton.click();
    await expect(
      page.getByRole('heading', { name: /ניהול תמונות - / }),
    ).toBeVisible();

    const deleteButtons = page.getByRole('button', { name: /^מחק / });
    const deleteCount = await deleteButtons.count();
    if (deleteCount > 0) {
      await expect(deleteButtons.first()).toBeVisible();
    }

    await page.locator('.mt-6.flex.justify-end').getByRole('button', { name: 'סגור' }).click();
  });
});
