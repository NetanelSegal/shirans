import { test, expect } from '@playwright/test';
import path from 'path';

const SERVER_URL = process.env.PLAYWRIGHT_SERVER_URL || 'http://localhost:3000';
const AUTH_API = `${SERVER_URL}/api/auth`;

const E2E_ADMIN_EMAIL = 'e2e-admin@example.com';
const E2E_ADMIN_PASSWORD = 'Admin123!';

/** 1×1 PNG — valid for multer + sharp + Cloudinary pipeline */
const FIXTURE_PNG = path.join(process.cwd(), 'e2e', 'fixtures', 'e2e-1x1.png');

/** Real upload hits Cloudinary; enable only when server `.env` has valid Cloudinary credentials */
const RUN_CLOUDINARY_UPLOAD_E2E = process.env.E2E_CLOUDINARY_UPLOAD === '1';

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
  await page.evaluate((token: string) => {
    localStorage.setItem('accessToken', token);
  }, body.accessToken);
}

test.describe.configure({ mode: 'serial', timeout: 180_000 });

test.describe('Admin — projects CRUD and media uploads', () => {
  let projectTitle: string;
  let editedTitle: string;

  test.beforeAll(() => {
    projectTitle = `E2E פרויקט ${Date.now()}`;
    editedTitle = `${projectTitle} (ערוך)`;
  });

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('create project with required fields', async ({ page }) => {
    await page.goto('/admin/projects', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('heading', { name: 'ניהול פרויקטים' }),
    ).toBeVisible({ timeout: 20_000 });

    await page.getByRole('button', { name: 'הוסף פרויקט' }).click();

    await expect(page.getByRole('heading', { name: 'הוספת פרויקט' })).toBeVisible();

    const categoryCheckbox = page.locator('input[id^="cat-"]').first();
    await expect(categoryCheckbox).toBeVisible({ timeout: 15_000 });

    await page.locator('#title').fill(projectTitle);
    await page.locator('#description').fill('תיאור בדיקות E2E');
    await page.locator('#location').fill('תל אביב');
    await page.locator('#client').fill('לקוח בדיקות');
    await page.locator('#constructionArea').fill('100');

    const checked = await categoryCheckbox.isChecked();
    if (!checked) {
      await categoryCheckbox.check();
    }

    await page.getByRole('button', { name: 'שמור' }).click();

    await expect(page.getByRole('heading', { name: 'הוספת פרויקט' })).not.toBeVisible({
      timeout: 30_000,
    });

    await expect(page.locator('tr').filter({ hasText: projectTitle })).toBeVisible({
      timeout: 15_000,
    });
  });

  test('upload MAIN, IMAGE, PLAN, and VIDEO assets via images modal', async ({
    page,
  }) => {
    test.skip(
      !RUN_CLOUDINARY_UPLOAD_E2E,
      'Set E2E_CLOUDINARY_UPLOAD=1 and ensure server has CLOUDINARY_* in .env to run this test',
    );

    await page.goto('/admin/projects', { waitUntil: 'domcontentloaded' });

    const row = page.locator('tr').filter({ hasText: projectTitle });
    await expect(row).toBeVisible({ timeout: 15_000 });

    await row.getByRole('button', { name: `תמונות ${projectTitle}` }).click();

    await expect(
      page.getByRole('heading', { name: new RegExp(`ניהול תמונות - ${projectTitle}`) }),
    ).toBeVisible({ timeout: 10_000 });

    const fileInput = page.locator('input[type="file"]');

    async function uploadAsType(label: string) {
      await page.locator('select').selectOption({ label });
      const uploadPromise = page.waitForResponse(
        (res) =>
          res.url().includes('/api/projects/uploadImgs') && res.request().method() === 'POST',
        { timeout: 120_000 },
      );
      await fileInput.setInputFiles(FIXTURE_PNG);
      const res = await uploadPromise;
      expect(res.ok(), `upload failed: ${res.status()}`).toBeTruthy();
    }

    await uploadAsType('ראשית');
    await expect(page.getByText('ראשית').first()).toBeVisible({ timeout: 30_000 });

    await uploadAsType('תמונה');
    await expect(page.getByText('תמונה').first()).toBeVisible({ timeout: 30_000 });

    await uploadAsType('תוכנית');
    await expect(page.getByText('תוכנית').first()).toBeVisible({ timeout: 30_000 });

    await uploadAsType('סרטון');
    await expect(page.getByText('סרטון').first()).toBeVisible({ timeout: 30_000 });

    await page.getByRole('button', { name: 'סגור' }).click();
    await expect(
      page.getByRole('heading', { name: new RegExp('ניהול תמונות') }),
    ).not.toBeVisible();
  });

  test('edit project title', async ({ page }) => {
    await page.goto('/admin/projects', { waitUntil: 'domcontentloaded' });

    const row = page.locator('tr').filter({ hasText: projectTitle });
    await expect(row).toBeVisible({ timeout: 15_000 });

    await row.getByRole('button', { name: `ערוך ${projectTitle}` }).click();

    await expect(page.getByRole('heading', { name: 'עריכת פרויקט' })).toBeVisible();

    await page.locator('#title').fill(editedTitle);
    await page.getByRole('button', { name: 'שמור' }).click();

    await expect(page.getByRole('heading', { name: 'עריכת פרויקט' })).not.toBeVisible({
      timeout: 30_000,
    });

    await expect(page.locator('tr').filter({ hasText: editedTitle })).toBeVisible({
      timeout: 15_000,
    });
  });

  test('delete project', async ({ page }) => {
    await page.goto('/admin/projects', { waitUntil: 'domcontentloaded' });

    const row = page.locator('tr').filter({ hasText: editedTitle });
    await expect(row).toBeVisible({ timeout: 15_000 });

    await row.getByRole('button', { name: `מחק ${editedTitle}` }).click();

    await expect(page.getByRole('heading', { name: 'מחיקת פרויקט' })).toBeVisible();

    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'מחק', exact: true })
      .click();

    await expect(row).not.toBeVisible({ timeout: 30_000 });
  });
});
