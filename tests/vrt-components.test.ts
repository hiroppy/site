import { expect, test } from "@playwright/test";
import { performSearch } from "./components/blogs";
import { clickMenuButton } from "./components/header";
import { setupPage } from "./utils/setupPage";

test.describe("Component VRT Tests", () => {
  // Hamburger menu test for mobile
  test("Hamburger menu shows links and contact (mobile)", async ({ page }) => {
    await setupPage(page, "http://localhost:3000/", {
      viewport: "mobile",
    });

    await clickMenuButton(page);
    await expect(page.getByRole("navigation")).toHaveScreenshot(
      "header-menu-mobile.png",
    );
  });

  // Blog search test
  test("Blog search results", async ({ page }) => {
    await setupPage(page, "http://localhost:3000/blog/1");

    await performSearch(page, "This article is for VRT.");
    await expect(page.locator("#search-results")).toHaveScreenshot(
      "blog-search-results.png",
    );
  });

  test("Contact modal form", async ({ page }) => {
    await setupPage(page, "http://localhost:3000/");

    await page.getByRole("button", { name: "お問い合わせ" }).first().click();

    const dialog = page.getByRole("dialog", { name: "お問い合わせ" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel(/技術顧問依頼/)).toBeVisible();
    await expect(dialog.getByLabel(/開発支援依頼/)).toBeVisible();
    await expect(dialog).toHaveScreenshot("contact-modal-form.png");
  });

  test("Contact modal opens from hash anchor", async ({ page }) => {
    await setupPage(page, "http://localhost:3000/#contact");

    const dialog = page.getByRole("dialog", { name: "お問い合わせ" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel(/技術顧問依頼/)).toBeVisible();
  });

  // Job related articles test for Mercari/Souzoh main job
  test("Job related articles expansion (Mercari/Souzoh main)", async ({
    page,
  }) => {
    await setupPage(page, "http://localhost:3000/jobs");

    // Find the specific Mercari/Souzoh main job card using aria-label directly
    const mercariMainCard = page.locator('[aria-label="main-Mercari/Souzoh"]');

    // Find the desktop layout (md:block) and click the related articles button
    const relatedArticlesButton = mercariMainCard
      .locator("details")
      .filter({ hasText: "関連記事" });

    await relatedArticlesButton.click();
    await page.waitForTimeout(1000);

    await expect(
      mercariMainCard.locator("details[open] .expandable-content"),
    ).toHaveScreenshot("job-related-articles-mercari-main.png");
  });
});
