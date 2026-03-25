import { test, expect } from "@playwright/test";

test.describe("Form Builder", () => {
  test("loads builder page", async ({ page }) => {
    await page.goto("/builder");
    // The "Builder" badge is always visible in the header
    await expect(page.locator('text=Builder').first()).toBeVisible({ timeout: 10_000 });
    // Form title is in an input — check its value, not text content
    const titleInput = page.locator('input[placeholder="Form title…"]');
    await expect(titleInput).toHaveValue("My Form", { timeout: 10_000 });
    // Section 1 tab is visible text in the canvas
    await expect(page.locator('text=Section 1').first()).toBeVisible({ timeout: 10_000 });
  });

  test("can change form title", async ({ page }) => {
    await page.goto("/builder");
    const titleInput = page.locator('input[placeholder="Form title…"]');
    await expect(titleInput).toBeVisible({ timeout: 10_000 });
    await titleInput.fill("My New Form");
    await expect(titleInput).toHaveValue("My New Form");
  });
});

test.describe("Workspace", () => {
  test("shows My Forms and Applications tabs", async ({ page }) => {
    await page.goto("/dynamic");
    await expect(page.locator("text=My Forms")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: "Applications" })).toBeVisible({ timeout: 10_000 });
  });

  test("empty state shows Open Builder button", async ({ page }) => {
    await page.goto("/dynamic");
    await expect(page.locator("text=Open Builder")).toBeVisible({ timeout: 10_000 });
  });
});
