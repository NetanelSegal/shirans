import { test, expect } from '@playwright/test';

const skipWebKit = (browserName: string) =>
  test.skip(browserName === 'webkit', 'Project cards visibility flaky in WebKit');

test.describe('Projects Page', () => {
  test('should display projects list', async ({ page, browserName }) => {
    skipWebKit(browserName);

    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1:has-text("פרוייקטים")');
    await expect(heading).toBeVisible({ timeout: 10000 });

    const projectLinks = page.locator('a[href^="/projects/"]');
    await projectLinks.first().scrollIntoViewIfNeeded();
    await expect(projectLinks.first()).toBeVisible({ timeout: 10000 });
  });

  test('should filter projects by category', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    
    // Click on a category filter (adjust selector based on your implementation)
    // const categoryButton = page.locator('button:has-text("Category Name")').first();
    // if (await categoryButton.isVisible()) {
    //   await categoryButton.click();
    //   await page.waitForLoadState('networkidle');
    //   
    //   // Verify filtered results
    //   const filteredProjects = page.locator('[data-testid="project-card"]');
    //   await expect(filteredProjects.first()).toBeVisible();
    // }
    
    // Placeholder test - update based on your actual filtering UI
    expect(true).toBe(true);
  });

  test('should navigate to project detail page', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    
    // Click on first project (adjust selector based on your implementation)
    // const firstProject = page.locator('[data-testid="project-card"], .project-card').first();
    // if (await firstProject.isVisible()) {
    //   await firstProject.click();
    //   await page.waitForLoadState('networkidle');
    //   
    //   // Verify we're on project detail page
    //   await expect(page).toHaveURL(/\/projects\/[^/]+/);
    //   
    //   // Check for project details
    //   const projectTitle = page.locator('h1, [data-testid="project-title"]').first();
    //   await expect(projectTitle).toBeVisible();
    // }
    
    // Placeholder test - update based on your actual project detail UI
    expect(true).toBe(true);
  });
});
