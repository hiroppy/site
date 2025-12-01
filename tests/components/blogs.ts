import { Page } from "@playwright/test";

export async function performSearch(page: Page, query: string) {
  const searchInput = page.getByRole("searchbox");
  await searchInput.fill(query);
  await page.waitForTimeout(1000);
}
