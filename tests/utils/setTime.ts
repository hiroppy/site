import { Page } from "@playwright/test";

export async function setTime(page: Page) {
  await page.clock.setFixedTime(new Date("2025-11-01T00:00:00Z"));
}
