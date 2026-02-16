import { test, expect } from '@playwright/test';

// Skip on WebKit (Safari) - IntersectionObserver bug causes motion.div whileInView
// to keep elements hidden. VITE_SKIP_ANIMATIONS bypass helps but WebKit still has
// flaky visibility detection for animated content.
const skipWebKit = (browserName: string) =>
  test.skip(browserName === 'webkit', 'Visibility flaky in WebKit');

test.describe('Projects load from API', () => {
  test('should display project cards on the projects page', async ({
    page,
    browserName,
  }) => {
    skipWebKit(browserName);

    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1:has-text("פרוייקטים")');
    await expect(heading).toBeVisible({ timeout: 10000 });

    const projectLinks = page.locator('a[href^="/projects/"]');
    await projectLinks.first().scrollIntoViewIfNeeded();
    await expect(projectLinks.first()).toBeVisible({ timeout: 10000 });

    const count = await projectLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should navigate to a single project and show details', async ({
    page,
    browserName,
  }) => {
    skipWebKit(browserName);

    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    const firstProjectLink = page.locator('a[href^="/projects/"]').first();
    await firstProjectLink.scrollIntoViewIfNeeded();
    await expect(firstProjectLink).toBeVisible({ timeout: 10000 });
    await firstProjectLink.click();

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/projects\/.+/);

    const locationCell = page.locator('td:has-text("מיקום")');
    await expect(locationCell).toBeVisible({ timeout: 10000 });

    const imagesHeading = page.locator('h3:has-text("תמונות")');
    await expect(imagesHeading).toBeVisible();
  });

  test('should show favourite projects carousel on homepage', async ({
    page,
    browserName,
  }) => {
    skipWebKit(browserName);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const favHeading = page.locator('h2:has-text("פרוייקטים נבחרים")');
    await expect(favHeading).toBeVisible({ timeout: 10000 });

    const carouselImages = page.locator('a[href^="/projects/"] img');
    await carouselImages.first().scrollIntoViewIfNeeded();
    await expect(carouselImages.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Testimonials load from API', () => {
  test('should display testimonials on the homepage', async ({
    page,
    browserName,
  }) => {
    skipWebKit(browserName);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const testimonialName = page.locator('h3').filter({ hasText: 'משפחת' });
    await testimonialName.first().scrollIntoViewIfNeeded();
    await expect(testimonialName.first()).toBeVisible({ timeout: 15000 });
  });
});
