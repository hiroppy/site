import { type Page, expect, test } from "@playwright/test";

const SCREENSHOT_OPTIONS = {
  animations: "disabled" as const,
  timeout: 30000,
};
const MOBILE_VIEWPORT = { width: 375, height: 667 };

async function setupPage(
  page: any,
  url: string,
  options: { viewport?: "mobile" | "desktop" } = {},
) {
  await page.goto(url, { waitUntil: "networkidle" });

  if (options.viewport === "mobile") {
    await page.setViewportSize(MOBILE_VIEWPORT);
  }

  await page.waitForLoadState("networkidle");
}

async function takeScreenshot(element: any, filename: string) {
  await expect(element).toHaveScreenshot(filename, SCREENSHOT_OPTIONS);
}

async function clickMenuButton(page: Page) {
  const menuButton = page.getByRole("button", { name: /menu|メニュー/i });
  await menuButton.click();
  await page.waitForTimeout(500);
}

async function performSearch(page: Page, query: string) {
  const searchInput = page.getByRole("searchbox");
  await searchInput.fill(query);
  await page.waitForTimeout(1000);
}

test.describe("Component VRT Tests", () => {
  // Hamburger menu test for mobile
  test("Hamburger menu shows links and contact (mobile)", async ({ page }) => {
    await setupPage(page, "http://localhost:3000/", {
      viewport: "mobile",
    });

    await clickMenuButton(page);
    await takeScreenshot(
      page.getByRole("navigation"),
      "header-menu-mobile.png",
    );
  });

  // Blog search test
  test("Blog search results", async ({ page }) => {
    await setupPage(page, "http://localhost:3000/blog");

    await performSearch(page, "This article is for VRT.");
    await takeScreenshot(
      page.locator("#search-results"),
      "blog-search-results.png",
    );
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

    await takeScreenshot(
      mercariMainCard.locator("details[open] .expandable-content"),
      "job-related-articles-mercari-main.png",
    );
  });
});
