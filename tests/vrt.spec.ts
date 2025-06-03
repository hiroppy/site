import { test, expect } from "@playwright/test";

const paths = ["/", "/jobs", "/blog", "/blog/vrt"];

for (const path of paths) {
  test(`VRT: ${path}`, async ({ page }) => {
    await page.goto(`http://localhost:3000${path}`, {
      waitUntil: "networkidle",
    });
    await expect(page).toHaveScreenshot({
      fullPage: true,
      scale: "device",
      mask: [
        page.locator('[data-testid="bookmark-count"]'),
        page.locator('[data-testid="star-count"]'),
      ],
    });
  });
}
