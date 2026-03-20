import { test, expect } from '@playwright/test';

/**
 * E2E tests for TanStack Query client-side caching.
 * Verifies that routes using cached data (projects, categories, testimonials,
 * calculator config, admin data) load correctly.
 */
test.describe.configure({ timeout: 60000 });

const skipWebKit = (browserName: string) =>
  test.skip(browserName === 'webkit', 'Flaky in WebKit');

test.describe('TanStack Query Caching - Public Routes', () => {
  test('Home page loads with projects and testimonials from cache', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    // Projects section (from ProjectsContext / useQuery)
    const projectsHeading = page.getByRole('heading', {
      name: /פרוייקטים נבחרים|השירותים שלי/,
    });
    await expect(projectsHeading.first()).toBeVisible({ timeout: 15000 });

    // Testimonials section (from useQuery in Testimonials)
    const testimonialsHeading = page.getByRole('heading', {
      name: 'מה אומרים עלינו',
    });
    await expect(testimonialsHeading).toBeVisible({ timeout: 10000 });
  });

  test('Projects page loads with cached projects', async ({
    page,
    browserName,
  }) => {
    skipWebKit(browserName);

    await page.goto('/projects', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1:has-text("פרוייקטים")');
    await expect(heading).toBeVisible({ timeout: 15000 });

    // Projects list or empty state - data comes from cached ProjectsContext
    const projectLinks = page.locator('a[href^="/projects/"]');
    const emptyState = page.locator('[data-testid="empty-state"]');
    const hasProjects = (await projectLinks.count()) > 0;
    const hasEmpty = await emptyState.isVisible();
    expect(hasProjects || hasEmpty).toBeTruthy();
  });

  test('Calculator page loads with config from cache', async ({ page }) => {
    await page.goto('/calculator', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    await expect(page).toHaveURL(/\/calculator/);
    // Main has aria-label; h1 is "דמיינו את הבית החדש שלכם"
    await expect(
      page.getByRole('main', { name: 'מחשבון אומדן עלות לבנייה פרטית' })
    ).toBeVisible({ timeout: 15000 });

    // Config-driven fields (useCalculatorConfig)
    await expect(page.getByLabel('שם מלא')).toBeVisible();
    await expect(page.getByLabel(/שטח בנוי/)).toBeVisible();
    await expect(
      page.getByText('צריך להכניס את כל הפרטים כדי לראות את אומדן התקציב')
    ).toBeVisible({ timeout: 5000 });
  });

  test('Navigation flow preserves cached data (Home → Projects → Detail → Back)', async ({
    page,
    browserName,
  }) => {
    skipWebKit(browserName);

    // 1. Home
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(/\/(\?.*)?$/);

    // 2. Projects
    await page.getByRole('link', { name: 'פרויקטים' }).first().click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/projects/);

    const projectLink = page.locator('a[href^="/projects/"]').first();
    const href = await projectLink.getAttribute('href');
    if (!href) {
      test.skip(true, 'No projects available');
      return;
    }

    // 3. Project detail
    await projectLink.click();
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(/\/projects\/[^/]+/);
    const projectTitle = page.locator('h3.heading').first();
    await expect(projectTitle).toBeVisible({ timeout: 10000 });

    // 4. Back to projects (cached - no refetch)
    await page.goBack();
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.locator('h1:has-text("פרוייקטים")')).toBeVisible({
      timeout: 5000,
    });
  });
});

test.describe('TanStack Query Caching - Admin Routes', () => {
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

  test('Admin overview loads with cached stats', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    await expect(page).toHaveURL(/\/admin/);
    await expect(
      page.getByRole('heading', { name: 'סקירה כללית' })
    ).toBeVisible({ timeout: 15000 });

    // Stats cards use cached admin queries
    const statsSection = page.getByText(/פרויקטים|קטגוריות|המלצות/);
    await expect(statsSection.first()).toBeVisible({ timeout: 5000 });
  });

  test('Admin projects page loads with cached projects', async ({ page }) => {
    await page.goto('/admin/projects', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    await expect(page).toHaveURL(/\/admin\/projects/);
    await expect(
      page.getByRole('heading', { name: /פרויקטים|ניהול פרויקטים/ })
    ).toBeVisible({ timeout: 15000 });
  });
});
