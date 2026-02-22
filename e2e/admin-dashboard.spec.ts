import { test, expect } from '@playwright/test';

const SERVER_URL = process.env.PLAYWRIGHT_SERVER_URL || 'http://localhost:3000';
const AUTH_API = `${SERVER_URL}/api/auth`;

const E2E_ADMIN_EMAIL = 'e2e-admin@example.com';
const E2E_ADMIN_PASSWORD = 'Admin123!';

test.describe.configure({ timeout: 60000 });

/** Login as admin and set token in localStorage for page context */
async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const response = await page.request.post(`${AUTH_API}/login`, {
    data: { email: E2E_ADMIN_EMAIL, password: E2E_ADMIN_PASSWORD },
  });
  if (!response.ok()) {
    throw new Error(`Admin login failed: ${response.status()}`);
  }
  const body = await response.json();
  if (!body.accessToken) {
    throw new Error('No accessToken in login response');
  }
  await page.evaluate((token) => {
    localStorage.setItem('accessToken', token);
  }, body.accessToken);
}

test.describe('Admin Dashboard - Access Control', () => {
  test('unauthenticated user is redirected to login when accessing /admin', async ({
    page,
  }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('regular user is redirected when accessing /admin', async ({
    page,
    request,
  }) => {
    const email = `regular-${Date.now()}@example.com`;
    await request.post(`${AUTH_API}/register`, {
      data: { email, password: 'Password123!', name: 'Regular User' },
    });

    const loginRes = await request.post(`${AUTH_API}/login`, {
      data: { email, password: 'Password123!' },
    });
    const { accessToken } = await loginRes.json();

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate((token) => {
      localStorage.setItem('accessToken', token);
    }, accessToken);

    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(/\/(login|$)/, { timeout: 10000 });
  });
});

test.describe('Admin Dashboard - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('admin can access dashboard overview', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByRole('heading', { name: 'סקירה כללית' })).toBeVisible({
      timeout: 15000,
    });
  });

  test('admin can navigate between dashboard sections', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    await page.getByRole('link', { name: /פרויקטים/ }).first().click();
    await expect(page).toHaveURL(/\/admin\/projects/, { timeout: 10000 });

    await page.getByRole('link', { name: /קטגוריות/ }).first().click();
    await expect(page).toHaveURL(/\/admin\/categories/, { timeout: 10000 });

    await page.getByRole('link', { name: /המלצות/ }).first().click();
    await expect(page).toHaveURL(/\/admin\/testimonials/, { timeout: 10000 });

    await page.getByRole('link', { name: /פניות צור קשר/ }).first().click();
    await expect(page).toHaveURL(/\/admin\/contacts/, { timeout: 10000 });

    await page.getByRole('link', { name: /סקירה כללית/ }).first().click();
    await expect(page).toHaveURL(/\/admin$/, { timeout: 10000 });
  });

  test('back to site link navigates to home', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    await page.getByRole('link', { name: 'חזרה לאתר' }).first().click();

    await expect(page).toHaveURL(/\/($|\?)/, { timeout: 10000 });
  });

  test('overview shows stats cards', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('פרויקטים')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('קטגוריות')).toBeVisible();
    await expect(page.getByText('המלצות')).toBeVisible();
    await expect(page.getByText('פניות שלא נקראו')).toBeVisible();
  });

  test('overview shows quick actions', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'פעולות מהירות' })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByRole('link', { name: 'הוסף פרויקט' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'צפה בפניות' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'הוסף המלצה' })).toBeVisible();
  });
});

test.describe('Admin Dashboard - Section Pages', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('projects page loads', async ({ page }) => {
    await page.goto('/admin/projects', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(/\/admin\/projects/);
    await expect(
      page
        .getByRole('heading', { name: 'ניהול פרויקטים' })
        .or(page.getByText('אין פרויקטים'))
    ).toBeVisible({ timeout: 15000 });
  });

  test('categories page loads', async ({ page }) => {
    await page.goto('/admin/categories', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(/\/admin\/categories/);
    await expect(
      page
        .getByRole('heading', { name: 'ניהול קטגוריות' })
        .or(page.getByText('אין קטגוריות'))
    ).toBeVisible({ timeout: 15000 });
  });

  test('testimonials page loads', async ({ page }) => {
    await page.goto('/admin/testimonials', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(/\/admin\/testimonials/);
    await expect(
      page
        .getByRole('heading', { name: 'ניהול המלצות' })
        .or(page.getByText('אין המלצות'))
    ).toBeVisible({ timeout: 15000 });
  });

  test('contacts page loads', async ({ page }) => {
    await page.goto('/admin/contacts', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(/\/admin\/contacts/);
    await expect(
      page
        .getByRole('heading', { name: 'ניהול פניות צור קשר' })
        .or(page.getByText('אין פניות'))
    ).toBeVisible({ timeout: 15000 });
  });
});
