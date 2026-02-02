import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that page title exists
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Wait for navigation to be visible
    await page.waitForLoadState('networkidle');
    
    // Check if navigation links exist (adjust selectors based on your actual navigation)
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });
});

test.describe('Projects Page', () => {
  test('should load projects page', async ({ page }) => {
    await page.goto('/projects');
    
    await page.waitForLoadState('networkidle');
    
    // Check that projects page heading is visible
    const heading = page.locator('h1:has-text("פרוייקטים")');
    await expect(heading).toBeVisible({ timeout: 10000 });
    
    // Check that page title is set correctly
    await expect(page).toHaveTitle(/פרויקטים/);
  });
});
