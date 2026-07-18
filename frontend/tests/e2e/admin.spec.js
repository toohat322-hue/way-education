import { test, expect } from '@playwright/test';

test.describe('Admin CMS Flows', () => {
  // We seeded the test DB with these credentials via our orchestrator script
  const ADMIN_EMAIL = 'admin@wayeducation.com';
  const ADMIN_PASSWORD = 'adminpassword';

  test.beforeEach(async ({ page }) => {
    // 1. Login before each test
    await page.goto('/admin');
    
    // Check if we are already logged in (if a previous test leaked session, though Playwright isolates them)
    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', ADMIN_EMAIL);
      await page.fill('input[type="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL('**/admin');
    }
  });

  test('should login successfully and view dashboard', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Dashboard' })).toBeVisible();
    await expect(page.locator('text=Total Leads')).toBeVisible();
  });

  test('should create, update, and delete a university', async ({ page }) => {
    // Navigate to Universities
    await page.click('a[href="/admin/universities"]');
    await expect(page.locator('h1', { hasText: 'Partner Universities' })).toBeVisible();

    // Open add modal
    await page.click('button:has-text("Add university")');
    await expect(page.locator('h3', { hasText: 'Add Partner University' })).toBeVisible();

    // Fill form
    const uniName = `Test University ${Date.now()}`;
    await page.fill('input#uni-name', uniName);
    await page.fill('input#uni-city-en', 'Istanbul');
    await page.fill('input#uni-city-ar', 'اسطنبول');
    await page.fill('input#uni-tuition', '3000');
    
    // Save
    await page.click('button[type="submit"]:has-text("Add university")');
    
    // Wait for modal to close
    await expect(page.locator('h3', { hasText: 'Add Partner University' })).toBeHidden();
    
    // Verify it appears in the list
    await expect(page.locator('text=' + uniName)).toBeVisible();

    // Edit the university
    // We use the parent container of the university name to find the edit button
    const card = page.locator('.p-5', { hasText: uniName });
    await card.locator('button:has-text("Edit")').click();
    
    // Update tuition
    await page.fill('input#uni-tuition', '4000');
    await page.click('button[type="submit"]:has-text("Save changes")');
    await expect(page.locator('h3', { hasText: 'Edit ' + uniName })).toBeHidden();

    // Delete the university
    page.once('dialog', dialog => dialog.accept());
    await card.locator('button[aria-label="Delete ' + uniName + '"]').click();
    
    // Verify it's gone
    await expect(page.locator('text=' + uniName)).toBeHidden();
  });

  test('should add a note to a lead', async ({ page }) => {
    // Navigate to Leads
    await page.click('a[href="/admin/leads"]');
    await expect(page.locator('h1', { hasText: 'Leads' })).toBeVisible();

    // The seed data includes some leads. Find the first row.
    const firstRow = page.locator('tbody tr').first();
    const leadName = await firstRow.locator('td').first().locator('.font-semibold').innerText();

    // Click Add Note
    page.once('dialog', dialog => {
      expect(dialog.message()).toBe('Add timeline note');
      dialog.accept('Test E2E Note');
    });
    
    // We use the aria-label we made or just the text Note
    await firstRow.locator('button:has-text("Note")').click();

    // Wait for the toast notification
    await expect(page.locator('text=Note added')).toBeVisible();
  });
});
