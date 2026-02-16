import { test, expect } from '@playwright/test';

const SERVER_URL = process.env.PLAYWRIGHT_SERVER_URL || 'http://localhost:3000';
const AUTH_API = `${SERVER_URL}/api/auth`;

test.describe('Form Error Display', () => {
  test.describe('Login Form - Server Errors', () => {
    test('should display error message for invalid credentials', async ({
      page,
    }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Fill in valid format but wrong credentials
      await page.fill('input[name="email"]', 'nonexistent@example.com');
      await page.fill('input[name="password"]', 'WrongPassword123!');

      // Submit the form
      await page.click('button[type="submit"]');

      // Wait for the error message to appear
      const errorDisplay = page.locator('.error-display');
      await expect(errorDisplay).toBeVisible({ timeout: 10000 });

      // Should show the server error message
      const errorMessage = page.locator('.error-message');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).not.toBeEmpty();
    });

    test('should display error message for wrong password on existing user', async ({
      page,
      request,
    }) => {
      // Register a user via API
      const email = `test-login-err-${Date.now()}@example.com`;
      await request.post(`${AUTH_API}/register`, {
        data: { email, password: 'Password123!', name: 'Test User' },
      });

      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Fill in correct email but wrong password
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', 'WrongPassword123!');

      await page.click('button[type="submit"]');

      const errorDisplay = page.locator('.error-display');
      await expect(errorDisplay).toBeVisible({ timeout: 10000 });

      const errorMessage = page.locator('.error-message');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).not.toBeEmpty();
    });

    test('should re-enable submit button after error', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      await page.fill('input[name="email"]', 'nonexistent@example.com');
      await page.fill('input[name="password"]', 'WrongPassword123!');

      const form = page.locator('form').first();
      const submitButton = form.locator('button[type="submit"]');
      await submitButton.click();

      // Wait for error to appear first (proves the request completed)
      await expect(page.locator('.error-display')).toBeVisible({ timeout: 10000 });

      // Button should be re-enabled (not stuck in loading)
      await expect(submitButton).toBeEnabled({ timeout: 5000 });
    });
  });

  test.describe('Login Form - Client Validation', () => {
    test('should show validation error for invalid email format', async ({
      page,
    }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="password"]', 'Password123!');

      await page.click('button[type="submit"]');

      // Should show inline validation error
      const validationError = page.locator('text=אימייל');
      await expect(validationError).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Register Form - Server Errors', () => {
    test('should display error message when email already exists', async ({
      page,
      request,
    }) => {
      // Register a user via API
      const email = `test-reg-dup-${Date.now()}@example.com`;
      await request.post(`${AUTH_API}/register`, {
        data: { email, password: 'Password123!', name: 'Existing User' },
      });

      await page.goto('/register');
      await page.waitForLoadState('networkidle');

      // Try to register with the same email
      await page.fill('input[name="name"]', 'New User');
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', 'Password123!');

      await page.locator('form').first().locator('button[type="submit"]').click();

      // Wait for the error message to appear
      const errorDisplay = page.locator('.error-display');
      await expect(errorDisplay).toBeVisible({ timeout: 10000 });

      const errorMessage = page.locator('.error-message');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).not.toBeEmpty();
    });

    test('should re-enable submit button after registration error', async ({
      page,
      request,
    }) => {
      // Register a user via API
      const email = `test-reg-btn-${Date.now()}@example.com`;
      await request.post(`${AUTH_API}/register`, {
        data: { email, password: 'Password123!', name: 'Existing User' },
      });

      await page.goto('/register');
      await page.waitForLoadState('networkidle');

      await page.fill('input[name="name"]', 'New User');
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', 'Password123!');

      const form = page.locator('form').first();
      const submitButton = form.locator('button[type="submit"]');
      await submitButton.click();

      // Wait for error to appear first (proves the request completed)
      await expect(page.locator('.error-display')).toBeVisible({ timeout: 10000 });

      // Button should be re-enabled
      await expect(submitButton).toBeEnabled({ timeout: 5000 });
    });
  });

  test.describe('Register Form - Client Validation', () => {
    test('should show validation error for weak password', async ({
      page,
    }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');

      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', '123');

      await page.locator('form').first().locator('button[type="submit"]').click();

      // Should show inline validation error for password
      const validationErrors = page.locator('form').first().locator('.text-red-500');
      await expect(validationErrors.first()).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Footer Contact Form - Client Validation', () => {
    test('should show validation errors when submitting empty form', async ({
      page,
    }) => {
      // Navigate to home page where footer is visible
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Scroll to footer
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();

      // Try to submit the form empty by clicking the submit button in the footer
      const submitButton = footer.locator('button[type="submit"]');
      if (await submitButton.isVisible()) {
        await submitButton.click();

        // Should show validation errors for required fields
        const validationErrors = footer.locator('.text-red-500');
        await expect(validationErrors.first()).toBeVisible({ timeout: 5000 });
      }
    });
  });
});
