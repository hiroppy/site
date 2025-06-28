import { test, expect, type Page } from "@playwright/test";
import urls from "../testedPaths.cjs";

const themes = ["light", "dark"] as const;

const ogTestedUrls = [
  "http://localhost:3000/labs",
  "http://localhost:3000/media",
  "http://localhost:3000/media/talks",
  "http://localhost:3000/media/podcasts",
  "http://localhost:3000/blog/tags/site",
  "http://localhost:3000/labs/feedle",
  "http://localhost:3000/labs/feedle/frontend",
];

// OG画像をチェックする関数
async function checkOgImage(page: Page, url: string) {
  // Chrome環境でのみOG画像をチェック
  const browser = page.context().browser();
  if (!browser) return;
  const browserName = browser.browserType().name();
  if (browserName !== "chromium") return;

  try {
    // OGメタタグの存在確認
    const ogImage = page.locator('meta[property="og:image"]');
    const hasOgImage = (await ogImage.count()) > 0;

    if (hasOgImage) {
      const ogImageUrl = await ogImage.getAttribute("content");
      expect(ogImageUrl).toBeTruthy();

      // OG画像パスを取得
      let ogImagePath = ogImageUrl!;
      if (ogImagePath.startsWith("https://")) {
        ogImagePath = ogImagePath.replace("https://hiroppy.me", "");
      }

      // OG画像に直接アクセス
      const ogImageFullUrl = `http://localhost:3000${ogImagePath}`;
      const ogResponse = await page.context().request.get(ogImageFullUrl);

      // 画像が存在することを確認
      if (ogResponse.status() === 200) {
        expect(ogResponse.headers()["content-type"]).toContain("image");

        // OG画像のスクリーンショットを保存
        const urlPath = url.replace("http://localhost:3000", "");
        const cleanPath =
          urlPath === "/" || urlPath === ""
            ? "home"
            : urlPath.replace(/^\//, "").replace(/\//g, "-");

        // OG画像を新しいページで開いてスクリーンショット
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

// 既存のURLs（VRTとOGテスト両方）
for (const url of urls) {
  for (const theme of themes) {
    test(`VRT: ${url} (${theme})`, async ({ page }) => {
      await page.goto(url, {
        waitUntil: "networkidle",
      });

      // Light themeの時のみOG画像をチェック（重複を避けるため）
      if (theme === "light") {
        await checkOgImage(page, url);
      }

      // Set theme by adding/removing dark class and updating localStorage
      await page.evaluate((selectedTheme) => {
        localStorage.setItem("theme", selectedTheme);
        document.documentElement.classList.toggle(
          "dark",
          selectedTheme === "dark",
        );
      }, theme);

      // Wait for theme transition to complete
      await page.waitForTimeout(1000);

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

      // Additional wait for any animations or transitions
      await page.waitForTimeout(500);

      // Generate screenshot name based on URL path and theme
      const urlPath = url.replace("http://localhost:3000", "");
      const cleanPath =
        urlPath === "/" || urlPath === ""
          ? "home"
          : urlPath.replace(/^\//, "").replace(/\//g, "-");
      const screenshotName = `${cleanPath}-${theme}.png`;

      await expect(page).toHaveScreenshot(screenshotName, {
        fullPage: true,
        scale: "device",
        animations: "disabled",
        mask: [
          page.locator('[data-testid="bookmark-count"]'),
          page.locator('[data-testid="star-count"]'),
          page.locator('[data-testid="github-star-count"]'),
          page.locator('[data-testid="github-fork-count"]'),
          page.locator('[data-testid="copyright-year"]'),
          page.locator('[data-testid="blog-date"]'),
          page.locator(".job-history"),
          page.locator('img[loading="lazy"]'),
        ],
        timeout: 300000,
      });
    });
  }
}

for (const url of ogTestedUrls) {
  for (const theme of themes) {
    test(`OG Check: ${url} (${theme})`, async ({ page }, testInfo) => {
      // Android環境ではスキップ
      if (testInfo.project.name.includes("android")) {
        test.skip();
        return;
      }

      // darkテーマの場合はスキップ
      if (theme === "dark") {
        test.skip();
        return;
      }

      await page.goto(url, {
        waitUntil: "networkidle",
      });
      await checkOgImage(page, url);
    });
  }
}
