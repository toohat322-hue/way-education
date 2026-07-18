import { test, expect } from "@playwright/test";

test("directory search and filters work", async ({ page }) => {
  await page.goto("/universities");

  await page.getByRole("searchbox").fill("Istanbul");
  await page.getByRole("combobox", { name: /Public|Private|حكومية|خاصة/i }).selectOption("Private");

  await expect(page.getByText(/Showing|عرض/i)).toBeVisible();
});

test("request info modal opens and closes", async ({ page }) => {
  await page.goto("/universities");

  await page.getByRole("button", { name: /Request Info|اطلب معلومات/i }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
