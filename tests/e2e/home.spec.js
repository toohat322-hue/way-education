import { test, expect } from "@playwright/test";

test("home renders key sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Türkiye starts here/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /All Universities|جميع الجامعات/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Apply Now|قدّم الآن/i }).first()).toBeVisible();
});

test("can navigate to university detail and open location tab", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Quick Apply|تقديم سريع/i }).first().click();

  await expect(page).toHaveURL(/\/university\//);
  await page.getByRole("button", { name: /Location|الموقع/i }).click();
  await expect(page.locator("iframe[title='map']")).toBeVisible();
});
