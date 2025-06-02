import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import urls from "../testedPaths.cjs";

for (const url of urls) {
  test(`A11y: ${url}`, async ({ page }) => {
    await page.goto(url, {
      waitUntil: "networkidle",
    });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(["link-in-text-block"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
}
