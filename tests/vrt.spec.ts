import { test, expect } from "@playwright/test";
import urls from "../testedPaths.cjs";

const themes = ["light", "dark"] as const;

for (const url of urls) {
  for (const theme of themes) {
    test(`VRT: ${url} (${theme})`, async ({ page }) => {
      await page.goto(url, {
        waitUntil: "networkidle",
      });

      // Set theme by adding/removing dark class and updating localStorage
      await page.evaluate((selectedTheme) => {
        localStorage.setItem("theme", selectedTheme);
        document.documentElement.classList.toggle(
          "dark",
          selectedTheme === "dark",
        );
      }, theme);

      // Wait for theme transition to complete
      await page.waitForTimeout(1000);

      // Wait for all images to load
      await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll("img"));
        return Promise.all(
          images.map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.addEventListener("load", resolve);
              img.addEventListener("error", resolve); // Resolve even on error to avoid hanging
              // Fallback timeout for individual images
              setTimeout(resolve, 10000);
            });
          }),
        );
      });

      // Wait for any lazy-loaded content
      await page.waitForLoadState("networkidle");

      // Additional wait for any animations or transitions
      await page.waitForTimeout(500);

      // Generate screenshot name based on URL path and theme
      const urlPath = url.replace("http://localhost:3000", "");
      const cleanPath =
        urlPath === "/" || urlPath === ""
          ? "home"
          : urlPath.replace(/^\//, "").replace(/\//g, "-");
      const screenshotName = `${cleanPath}-${theme}.png`;

      await expect(page).toHaveScreenshot(screenshotName, {
        fullPage: true,
        scale: "device",
        animations: "disabled",
        mask: [
          page.locator('[data-testid="bookmark-count"]'),
          page.locator('[data-testid="star-count"]'),
          page.locator('[data-testid="github-star-count"]'),
          page.locator('[data-testid="github-fork-count"]'),
          page.locator('[data-testid="copyright-year"]'),
          page.locator('[data-testid="blog-date"]'),
          page.locator(".job-history"),
          page.locator('img[loading="lazy"]'),
        ],
        timeout: 120000,
      });
    });
  }
}
