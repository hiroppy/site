import { expect, Page } from "@playwright/test";

export async function fetchWithoutRedirects(
  page: Page,
  pathname: string,
): Promise<{ status: number; headers: Record<string, string> }> {
  const response = await page
    .context()
    .request.get(`http://localhost:3000${pathname}`, { maxRedirects: 0 });
  return {
    status: response.status(),
    headers: response.headers(),
  };
}

export async function verifyRedirectDestination(
  page: Page,
  fromPath: string,
  expectedFinalPath: string,
): Promise<void> {
  await page.goto(`http://localhost:3000${fromPath}`);

  await page.waitForLoadState("networkidle");

  const finalUrl = page.url();
  const finalPath = new URL(finalUrl).pathname;

  expect(finalPath).toBe(expectedFinalPath);
}

export async function fetchOGImage(
  page: Page,
  imagePath: string,
): Promise<{
  status: number;
  contentType: string;
  buffer: Buffer;
}> {
  const response = await page
    .context()
    .request.get(`http://localhost:3000${imagePath}`);
  return {
    status: response.status(),
    contentType: response.headers()["content-type"] || "",
    buffer: await response.body(),
  };
}
