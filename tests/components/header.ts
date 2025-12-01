import { Page } from "@playwright/test";

export async function clickMenuButton(page: Page) {
  const menuButton = page.getByRole("button", { name: /menu|メニュー/i });
  await menuButton.click();
  await page.waitForTimeout(500);
}
