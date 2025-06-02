import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const paths = ["/", "/jobs", "/blog", "/blog/vrt"];

for (const path of paths) {
  test(`A11y: ${path}`, async ({ page }) => {
    await page.goto(`http://localhost:3000${path}`, {
      waitUntil: "networkidle",
    });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(["link-in-text-block"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
}
