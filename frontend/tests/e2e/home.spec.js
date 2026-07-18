import { test, expect } from "@playwright/test";

test("home renders key sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /starts here/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "All Universities" })).toBeVisible();
});

test("can navigate to university detail and open location tab", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("university-detail-iau").filter({ visible: true }).click();

  await expect(page).toHaveURL(/\/university\/iau$/);
  await page.getByRole("button", { name: "Location" }).click();
  await expect(page.locator("iframe[title='map']")).toBeVisible();
});
