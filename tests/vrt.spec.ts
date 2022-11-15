import { test, expect } from "@playwright/test";

const paths = <const>[
  "/",
  "/jobs",
  "/blog",
  "/blog/vrt",
  "/media/achievements",
];

for (const path of paths) {
  test(`VRT: ${path}`, async ({ page }) => {
    await page.goto(`http://localhost:3000${path}`);
    await expect(page).toHaveScreenshot({
      fullPage: true,
      scale: "device",
    });
  });
}
