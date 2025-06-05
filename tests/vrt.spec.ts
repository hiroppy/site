import { test, expect } from "@playwright/test";
import urls from "../testedPaths.cjs";

const themes = ["light", "dark"] as const;

for (const url of urls) {
  for (const theme of themes) {
    test(`VRT: ${url} (${theme})`, async ({ page }) => {
      await page.goto(url, {
        waitUntil: "load",
      });

      // Set theme by adding/removing dark class and updating localStorage
      await page.evaluate((selectedTheme) => {
        localStorage.setItem("theme", selectedTheme);
        document.documentElement.classList.toggle(
          "dark",
          selectedTheme === "dark",
        );
      }, theme);

      // Wait a bit for theme transition to complete
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot({
        fullPage: true,
        scale: "device",
        mask: [
          page.locator('[data-testid="bookmark-count"]'),
          page.locator('[data-testid="star-count"]'),
          page.locator('[data-testid="github-star-count"]'),
          page.locator('[data-testid="github-fork-count"]'),
          page.locator('[data-testid="copyright-year"]'),
          page.locator('[data-testid="blog-date"]'),
          page.locator(".job-history"),
        ],
        timeout: 30000,
      });
    });
  }
}
