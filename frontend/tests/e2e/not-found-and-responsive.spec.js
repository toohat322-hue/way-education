import { test, expect } from "@playwright/test";

test("unknown route shows 404 page", async ({ page }) => {
  await page.goto("/missing-page");
  await expect(page.getByText("404")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Page Not Found/i }),
  ).toBeVisible();
});

test("mobile menu opens and contains navigation links", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Runs only on mobile profile");

  await page.goto("/");
  await page.getByRole("button", { name: /menu/i }).click();

  await expect(page.getByRole("link", { name: /About|من نحن/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Contact|تواصل معنا/i }),
  ).toBeVisible();
});
