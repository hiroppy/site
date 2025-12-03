import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import urls from "../testedPaths.cjs";

for (const url of urls) {
  test(`A11y: ${url}`, async ({ page }) => {
    await page.goto(url, {
      waitUntil: "networkidle",
    });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(["meta-viewport"])
      .exclude("pre")
      .exclude("pre *")
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
}
