import { Page } from "@playwright/test";

export async function setupPage(
  page: Page,
  url: string,
  options: { viewport?: "mobile" | "desktop" } = {},
) {
  await page.goto(url, { waitUntil: "networkidle" });

  if (options.viewport === "mobile") {
    await page.setViewportSize({
      width: 375,
      height: 667,
    });
  }

  await page.waitForLoadState("networkidle");
}
