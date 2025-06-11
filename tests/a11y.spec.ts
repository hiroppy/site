import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import urls from "../testedPaths.cjs";

for (const url of urls) {
  test(`A11y: ${url}`, async ({ page }) => {
    await page.goto(url, {
      waitUntil: "networkidle",
    });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(["meta-viewport"])
      .exclude("pre.astro-code")
      .exclude("pre.astro-code *")
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
}
