import { Page } from "@playwright/test";

export async function setupPage(
  page: Page,
  url: string,
  options: { viewport?: "mobile" | "desktop" } = {},
) {
  if (options.viewport === "mobile") {
    await page.setViewportSize({
      width: 375,
      height: 667,
    });
  }

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForLoadState("networkidle");
}
