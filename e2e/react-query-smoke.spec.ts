import { test, expect } from '@playwright/test';

/**
 * Smoke E2E: pages that load data via TanStack Query render correctly.
 * Does not assert cache hits or request deduplication (see optional test below).
 */
test.describe.configure({ timeout: 60000 });

test.describe('React Query smoke — public routes', () => {
  test('Home page shows projects and testimonials sections', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    const projectsHeading = page.getByRole('heading', {
      name: /פרוייקטים נבחרים|השירותים שלי/,
    });
    await expect(projectsHeading.first()).toBeVisible({ timeout: 15000 });

    const testimonialsHeading = page.getByRole('heading', {
      name: 'מה אומרים עלינו',
    });
    await expect(testimonialsHeading).toBeVisible({ timeout: 10000 });
  });

  test('Projects page loads list or empty state', async ({ page }) => {
    await page.goto('/projects', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    const heading = page.locator('h1:has-text("פרוייקטים")');
    await expect(heading).toBeVisible({ timeout: 15000 });

    const projectLinks = page.locator('a[href^="/projects/"]');
    const emptyState = page.locator('[data-testid="empty-state"]');
    // Wait for TanStack Query + DataStateGuard (not still on loading-state)
    await expect(async () => {
      const loading = await page.locator('[data-testid="loading-state"]').isVisible();
      expect(loading).toBe(false);
      const hasProjects = (await projectLinks.count()) > 0;
      const hasEmpty = await emptyState.isVisible();
      expect(hasProjects || hasEmpty).toBeTruthy();
    }).toPass({ timeout: 20000 });
  });

  test('Calculator page loads config-driven UI', async ({ page }) => {
    await page.goto('/calculator', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    await expect(page).toHaveURL(/\/calculator/);
    await expect(
      page.getByRole('main', { name: 'מחשבון אומדן עלות לבנייה פרטית' })
    ).toBeVisible({ timeout: 15000 });

    await expect(page.getByLabel('שם מלא')).toBeVisible();
    await expect(page.getByLabel(/שטח בנוי/)).toBeVisible();
    await expect(
      page.getByText('צריך להכניס את כל הפרטים כדי לראות את אומדן התקציב')
    ).toBeVisible({ timeout: 5000 });
  });

  test('Navigation Home → Projects → Detail → Back', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(/\/(\?.*)?$/);

    await page.getByRole('link', { name: 'פרויקטים' }).first().click();
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.locator('h1:has-text("פרוייקטים")')).toBeVisible({
      timeout: 15000,
    });

    const projectLink = page.locator('a[href^="/projects/"]').first();
    const href = await projectLink.getAttribute('href');
    if (!href) {
      test.skip(true, 'No projects available');
      return;
    }

    await projectLink.click();
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(/\/projects\/[^/]+/);
    const projectTitle = page.locator('h3.heading').first();
    await expect(projectTitle).toBeVisible({ timeout: 10000 });

    await page.goBack();
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.locator('h1:has-text("פרוייקטים")')).toBeVisible({
      timeout: 15000,
    });
  });

  test('Projects list GET is not repeated excessively after Home then Projects', async ({
    page,
  }) => {
    let listGets = 0;
    await page.route('**/api/projects', (route) => {
      const req = route.request();
      if (req.method() !== 'GET') {
        void route.continue();
        return;
      }
      const url = req.url();
      if (url.includes('/single') || url.includes('/favourites')) {
        void route.continue();
        return;
      }
      listGets += 1;
      void route.continue();
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');
    await expect(
      page.getByRole('heading', {
        name: /פרוייקטים נבחרים|השירותים שלי/,
      }).first()
    ).toBeVisible({ timeout: 15000 });

    await page.goto('/projects', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');
    await expect(page.locator('h1:has-text("פרוייקטים")')).toBeVisible({
      timeout: 15000,
    });

    // File-data mode: 0. API mode + React Query cache: typically 1; allow slack for dev/StrictMode.
    expect(listGets).toBeLessThanOrEqual(4);
  });
});

test.describe('React Query smoke — admin routes', () => {
  const E2E_ADMIN_EMAIL = 'e2e-admin@example.com';
  const E2E_ADMIN_PASSWORD = 'Admin123!';
  const SERVER_URL = process.env.PLAYWRIGHT_SERVER_URL || 'http://localhost:3000';
  const AUTH_API = `${SERVER_URL}/api/auth`;

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

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Admin overview loads stats', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    await expect(page).toHaveURL(/\/admin/);
    await expect(
      page.getByRole('heading', { name: 'סקירה כללית' })
    ).toBeVisible({ timeout: 15000 });

    const statsSection = page.getByText(/פרויקטים|קטגוריות|המלצות/);
    await expect(statsSection.first()).toBeVisible({ timeout: 5000 });
  });

  test('Admin projects page loads', async ({ page }) => {
    await page.goto('/admin/projects', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    await expect(page).toHaveURL(/\/admin\/projects/);
    await expect(
      page.getByRole('heading', { name: /פרויקטים|ניהול פרויקטים/ })
    ).toBeVisible({ timeout: 15000 });
  });
});
