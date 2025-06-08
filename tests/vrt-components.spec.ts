import { test, expect, type Page } from "@playwright/test";

type Theme = (typeof themes)[number];

const themes = ["light", "dark"] as const;
const SCREENSHOT_OPTIONS = {
  animations: "disabled" as const,
  timeout: 30000,
};
const MOBILE_VIEWPORT = { width: 375, height: 667 };

async function setupPage(
  page: any,
  url: string,
  options: { theme?: Theme; viewport?: "mobile" | "desktop" } = {},
) {
  await page.goto(url, { waitUntil: "networkidle" });

  if (options.viewport === "mobile") {
    await page.setViewportSize(MOBILE_VIEWPORT);
  }

  if (options.theme) {
    await setTheme(page, options.theme);
  }

  await page.waitForLoadState("networkidle");
}

async function setTheme(page: Page, theme: Theme) {
  await page.evaluate((selectedTheme: any) => {
    localStorage.setItem("theme", selectedTheme);
    document.documentElement.classList.toggle("dark", selectedTheme === "dark");
  }, theme);
  await page.waitForTimeout(1000);
}

async function takeScreenshot(element: any, filename: string) {
  await expect(element).toHaveScreenshot(filename, SCREENSHOT_OPTIONS);
}

async function clickMenuButton(page: any) {
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
  // Header icon test for PC when scrolling
  test("Header icon appears on scroll (PC)", async ({ page }) => {
    await setupPage(page, "http://localhost:3000/", { viewport: "desktop" });

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);

    await takeScreenshot(
      page.locator("header"),
      "header-icon-on-scroll-pc.png",
    );
  });

  // Hamburger menu test for mobile (both themes)
  for (const theme of themes) {
    test(`Hamburger menu shows links and contact (mobile ${theme})`, async ({
      page,
    }) => {
      await setupPage(page, "http://localhost:3000/", {
        viewport: "mobile",
        theme,
      });

      await clickMenuButton(page);
      await takeScreenshot(
        page.getByRole("navigation"),
        `header-menu-mobile-${theme}.png`,
      );
    });
  }

  // Blog search test for both themes
  for (const theme of themes) {
    test(`Blog search results (${theme})`, async ({ page }) => {
      await setupPage(page, "http://localhost:3000/blog", { theme });

      await performSearch(page, "This article is for VRT.");
      await takeScreenshot(
        page.locator("#search-results"),
        `blog-search-results-${theme}.png`,
      );
    });
  }

  // Job related articles test for Mercari/Souzoh main job (Chrome only)
  test("Job related articles expansion (Mercari/Souzoh main)", async ({
    page,
  }) => {
    await setupPage(page, "http://localhost:3000/jobs");

    // Find the specific Mercari/Souzoh main job card using aria-label directly
    const mercariMainCard = page.locator('[aria-label="main-Mercari/Souzoh"]');

    // Find the desktop layout (md:block) and click the related articles button
    const relatedArticlesButton = mercariMainCard
      .locator(".hidden.md\\:block details summary")
      .filter({ hasText: "関連記事" });

    await relatedArticlesButton.click();
    await page.waitForTimeout(1000);

    await takeScreenshot(
      mercariMainCard.locator("details[open] .expandable-content"),
      "job-related-articles-mercari-main.png",
    );
  });
});
