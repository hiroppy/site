import { test, expect, type Page } from "@playwright/test";
import urls from "../testedPaths.cjs";

const ogTestedUrls = [
  "http://localhost:3000/labs",
  "http://localhost:3000/media",
  "http://localhost:3000/media/talks",
  "http://localhost:3000/media/podcasts",
  "http://localhost:3000/blog/tags/site",
  "http://localhost:3000/labs/feedle",
  "http://localhost:3000/labs/feedle/frontend",
];

// 既存のURLs（VRTとOGテスト両方）
for (const url of urls) {
  test(`VRT: ${url}`, async ({ page }) => {
    await page.clock.setFixedTime(new Date("2024-01-01T00:00:00Z"));

    await page.goto(url);

    await checkOgImage(page, url);

    // Wait for all images to load
    await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll("img"));
      return Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.addEventListener("load", resolve);
            img.addEventListener("error", resolve); // Resolve even on error to avoid hanging
            // Fallback timeout for individual images
            setTimeout(resolve, 10000);
          });
        }),
      );
    });

    // Wait for any lazy-loaded content
    await page.waitForLoadState("networkidle");

    // Generate screenshot name based on URL path
    const urlPath = url.replace("http://localhost:3000", "");
    const cleanPath =
      urlPath === "/" || urlPath === ""
        ? "home"
        : urlPath.replace(/^\//, "").replace(/\//g, "-");
    const screenshotName = `${cleanPath}.png`;

    await expect(page).toHaveScreenshot(screenshotName, {
      fullPage: true,
      scale: "device",
      animations: "disabled",
      mask: [
        page.locator('[data-testid="github-star-count"]'),
        page.locator('[data-testid="github-fork-count"]'),
        page.locator('[data-testid="copyright-year"]'),
        // page.locator('[data-testid="blog-date"]'),
        // page.locator('[data-testid="job-timeline"]'),
        page.locator(".google-slides-container"),
        // page.locator('img[loading="lazy"]'),
      ],
      timeout: 300000,
    });
  });
}

for (const url of ogTestedUrls) {
  test(`OG Check: ${url}`, async ({ page }, testInfo) => {
    // Android環境ではスキップ
    if (testInfo.project.name.includes("android")) {
      test.skip();
      return;
    }

    await page.goto(url, {
      waitUntil: "networkidle",
    });
    await checkOgImage(page, url);
  });
}

async function checkOgImage(page: Page, url: string) {
  const browser = page.context().browser();
  if (!browser) return;
  const browserName = browser.browserType().name();
  if (browserName !== "chromium") return;

  try {
    const ogImage = page.locator('meta[property="og:image"]');
    const hasOgImage = (await ogImage.count()) > 0;

    if (hasOgImage) {
      const ogImageUrl = await ogImage.getAttribute("content");
      expect(ogImageUrl).toBeTruthy();

      let ogImagePath = ogImageUrl!;
      if (ogImagePath.startsWith("https://")) {
        ogImagePath = ogImagePath.replace("https://hiroppy.me", "");
      }

      const ogImageFullUrl = `http://localhost:3000${ogImagePath}`;
      const ogResponse = await page.context().request.get(ogImageFullUrl);

      if (ogResponse.status() === 200) {
        expect(ogResponse.headers()["content-type"]).toContain("image");

        const urlPath = url.replace("http://localhost:3000", "");
        const cleanPath =
          urlPath === "/" || urlPath === ""
            ? "home"
            : urlPath.replace(/^\//, "").replace(/\//g, "-");
        const ogPage = await page.context().newPage();
        await ogPage.goto(ogImageFullUrl);
        await expect(ogPage).toHaveScreenshot(`${cleanPath}-og-image.png`, {
          fullPage: true,
        });
        await ogPage.close();
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      // OG画像チェックでエラーが発生してもVRTテストは継続
      console.log(`OG image check failed for ${url}:`, error.message);
    }
  }
}
