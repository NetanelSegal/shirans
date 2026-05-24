import { test, expect } from '@playwright/test';

const skipWebKit = (browserName: string) =>
  test.skip(browserName === 'webkit', 'Project cards visibility flaky in WebKit');

test.describe('Projects Page', () => {
  test('should display projects list with thumbnails', async ({ page, browserName }) => {
    skipWebKit(browserName);

    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1:has-text("פרוייקטים")');
    await expect(heading).toBeVisible({ timeout: 10000 });

    const projectLinks = page.locator('a[href^="/projects/"]');
    await projectLinks.first().scrollIntoViewIfNeeded();
    await expect(projectLinks.first()).toBeVisible({ timeout: 10000 });

    const thumbnail = page.locator('a[href^="/projects/"] img').first();
    await expect(thumbnail).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to project detail and show media sections', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    const firstProjectLink = page.locator('a[href^="/projects/"]').first();
    await expect(firstProjectLink).toBeVisible({ timeout: 10000 });
    await firstProjectLink.click();

    await expect(page).toHaveURL(/\/projects\/[^/]+/, { timeout: 10000 });

    const heroImage = page.locator('.breakout-x-padding img').first();
    await expect(heroImage).toBeVisible({ timeout: 10000 });

    await expect(page.getByRole('heading', { name: 'תמונות' })).toBeVisible({
      timeout: 10000,
    });
  });

  test('home page shows favourite projects when available', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const favouritesHeading = page.getByRole('heading', { name: 'פרוייקטים נבחרים' });
    const isVisible = await favouritesHeading.isVisible().catch(() => false);

    if (isVisible) {
      await expect(page.locator('a[href^="/projects/"] img').first()).toBeVisible({
        timeout: 10000,
      });
    }
  });
});
