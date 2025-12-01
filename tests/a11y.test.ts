import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { COMMON } from "../testedPaths.cjs";

test.describe("Page a11y Tests", () => {
  for (const url of COMMON) {
    test(url, async ({ page }) => {
      await page.goto(url, {
        waitUntil: "networkidle",
      });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .disableRules([])
        .exclude("pre")
        .exclude("pre *")
        .exclude(".youtube-container")
        .exclude(".twitter-container")
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
