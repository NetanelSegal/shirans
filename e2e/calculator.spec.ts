import { test, expect } from '@playwright/test';

const SERVER_URL = process.env.PLAYWRIGHT_SERVER_URL || 'http://localhost:3000';
const AUTH_API = `${SERVER_URL}/api/auth`;

const E2E_ADMIN_EMAIL = 'e2e-admin@example.com';
const E2E_ADMIN_PASSWORD = 'Admin123!';

test.describe.configure({ timeout: 60000 });

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

test.describe('Calculator Page', () => {
  test('calculator page loads with empty form and not fully entered state', async ({ page }) => {
    await page.goto('/calculator', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(/\/calculator/);
    await expect(page.getByRole('heading', { name: 'מחשבון אומדן עלות לבנייה פרטית' })).toBeVisible({
      timeout: 15000,
    });

    await expect(page.getByText('מלא את כל השדות למעלה כדי לראות את אומדן התקציב')).toBeVisible({
      timeout: 5000,
    });

    await expect(page.getByLabel('שם מלא')).toBeVisible();
    await expect(page.getByLabel('מספר טלפון')).toBeVisible();
    await expect(page.getByLabel('כתובת אימייל')).toBeVisible();
  });

  test('calculator page has RTL layout', async ({ page }) => {
    await page.goto('/calculator', { waitUntil: 'domcontentloaded' });

    const main = page.getByRole('main', { name: 'מחשבון אומדן עלות לבנייה פרטית' });
    await expect(main).toHaveAttribute('dir', 'rtl');
  });
});

test.describe('Admin Calculator Config', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('calculator config page loads with builtAreaSqmRange section', async ({ page }) => {
    await page.goto('/admin/calculator-config', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(/\/admin\/calculator-config/);
    await expect(page.getByRole('heading', { name: 'הגדרות מחשבון אומדן' })).toBeVisible({
      timeout: 15000,
    });

    await expect(page.getByText('טווח שטח בנוי')).toBeVisible();
    await expect(page.getByLabel('מינימום').first()).toBeVisible();
    await expect(page.getByLabel('מקסימום').first()).toBeVisible();
  });

  test('calculator leads page loads', async ({ page }) => {
    await page.goto('/admin/calculator-leads', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(/\/admin\/calculator-leads/);
    await expect(
      page
        .getByRole('heading', { name: 'לידים ממחשבון אומדן' })
        .or(page.getByText('אין לידים'))
    ).toBeVisible({ timeout: 15000 });
  });
});
