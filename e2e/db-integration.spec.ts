import { test, expect } from '@playwright/test';

test.describe('Projects load from API', () => {
  test('should display project cards on the projects page', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    // Heading should be visible
    const heading = page.locator('h1:has-text("פרוייקטים")');
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Project links should render (from API data)
    const projectLinks = page.locator('a[href^="/projects/"]');
    await expect(projectLinks.first()).toBeVisible({ timeout: 10000 });

    // Should have at least 1 project displayed
    const count = await projectLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should navigate to a single project and show details', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    // Click the first project link
    const firstProjectLink = page.locator('a[href^="/projects/"]').first();
    await expect(firstProjectLink).toBeVisible({ timeout: 10000 });
    await firstProjectLink.click();

    await page.waitForLoadState('networkidle');

    // Should be on a project detail page
    await expect(page).toHaveURL(/\/projects\/.+/);

    // Project detail should show location info (the info table)
    const locationCell = page.locator('td:has-text("מיקום")');
    await expect(locationCell).toBeVisible({ timeout: 10000 });

    // Images section should exist
    const imagesHeading = page.locator('h3:has-text("תמונות")');
    await expect(imagesHeading).toBeVisible();
  });

  test('should show favourite projects carousel on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Favourite projects section heading
    const favHeading = page.locator('h2:has-text("פרוייקטים נבחרים")');
    await expect(favHeading).toBeVisible({ timeout: 10000 });

    // Should have at least one project image in the carousel
    const carouselImages = page.locator('a[href^="/projects/"] img');
    await expect(carouselImages.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Testimonials load from API', () => {
  test('should display testimonials on the homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // At least one testimonial name should be visible
    // The testimonials are in an infinite scroll, so we look for any h3 within the testimonials area
    const testimonialName = page.locator('h3').filter({ hasText: 'משפחת' });
    await expect(testimonialName.first()).toBeVisible({ timeout: 15000 });
  });
});
