import { test, expect } from "@playwright/test";
// @ts-expect-error
import paths from "../testedPaths.cjs";

for (const path of paths) {
  test(`VRT: ${path}`, async ({ page }) => {
    await page.goto(`http://localhost:3000${path}`);
    await expect(page).toHaveScreenshot({
      fullPage: true,
      scale: "device",
    });
  });
}
