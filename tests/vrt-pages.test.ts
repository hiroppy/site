import { expect, test } from "@playwright/test";
import { VRT_URLS } from "../testedPaths.cjs";
import { getPathAndOutputDirname } from "./utils/getPathAndOutputDirname";
import { setTime } from "./utils/setTime";

test.describe("Page VRT Tests", () => {
  for (const url of VRT_URLS) {
    test(url, async ({ page }) => {
      await setTime(page);

      await page.goto(url);

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

      await page.waitForLoadState("networkidle");

      const { output } = getPathAndOutputDirname(url);
      const projectName = test.info().project.name;

      await expect(page).toHaveScreenshot([output, `${projectName}.png`], {
        fullPage: true,
        scale: "device",
        animations: "disabled",
        mask: [
          page.locator('[data-testid="github-star-count"]'),
          page.locator('[data-testid="github-fork-count"]'),
          page.locator('[data-testid="copyright-year"]'),
          page.locator(".google-slides-container"),
          page.locator(".youtube-container"),
          page.locator(".twitter-container"),
          // page.locator('img[loading="lazy"]'),
        ],
        timeout: 600000,
      });
    });
  }
});
