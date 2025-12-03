import { type Page, expect, test } from "@playwright/test";
import testedUrls from "../testedPaths.cjs";

interface MetadataSnapshot {
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogUrl: string | null;
  ogType: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  twitterCreator: string | null;
  title: string;
  description: string | null;
  canonical: string | null;
}

const urls = [...testedUrls, "http://localhost:3000/blog/404"];
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
  test(`VRT: ${url}`, async ({ page }, testInfo) => {
    await page.clock.setFixedTime(new Date("2025-12-01T00:00:00Z"));

    await page.goto(url);

    if (!testInfo.project.name.includes("android")) {
      await checkMetadata(page, url);
    }

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

    const { output } = getPathAndOutputDirname(url);
    const projectName = test.info().project.name;
    const screenshotName = `${projectName}.png`;

    await expect(page).toHaveScreenshot([output, screenshotName], {
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
    await checkMetadata(page, url);
  });
}

async function extractMetaTags(page: Page): Promise<MetadataSnapshot> {
  return await page.evaluate(() => {
    const getMeta = (selector: string) =>
      document.querySelector(selector)?.getAttribute("content") || null;

    return {
      // OpenGraph tags
      ogTitle: getMeta('meta[property="og:title"]'),
      ogDescription: getMeta('meta[property="og:description"]'),
      ogImage: getMeta('meta[property="og:image"]'),
      ogUrl: getMeta('meta[property="og:url"]'),
      ogType: getMeta('meta[property="og:type"]'),

      // Twitter tags
      twitterCard: getMeta('meta[name="twitter:card"]'),
      twitterTitle: getMeta('meta[name="twitter:title"]'),
      twitterDescription: getMeta('meta[name="twitter:description"]'),
      twitterImage: getMeta('meta[name="twitter:image"]'),
      twitterCreator: getMeta('meta[name="twitter:creator"]'),

      // Standard meta tags
      title: document.title,
      description: getMeta('meta[name="description"]'),
      canonical:
        document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
        null,
    };
  });
}

async function validateOgImage(page: Page, url: string, ogImageUrl: string) {
  let ogImagePath = ogImageUrl;
  if (ogImagePath.startsWith("https://")) {
    ogImagePath = ogImagePath.replace("https://hiroppy.me", "");
  }

  const ogImageFullUrl = `http://localhost:3000${ogImagePath}`;
  const ogResponse = await page.context().request.get(ogImageFullUrl);

  if (ogResponse.status() === 200) {
    expect(ogResponse.headers()["content-type"]).toContain("image");

    const ogPage = await page.context().newPage();
    await ogPage.goto(ogImageFullUrl);

    const { output } = getPathAndOutputDirname(url);
    await expect(ogPage).toHaveScreenshot([output, "og-image.png"], {
      fullPage: true,
    });
    await ogPage.close();
  }
}

async function snapshotMetaTags(metadata: MetadataSnapshot, url: string) {
  const { output } = getPathAndOutputDirname(url);
  const metadataJson = JSON.stringify(metadata, null, 2);

  expect(metadataJson).toMatchSnapshot([output, "metadata.json"]);
}

async function checkMetadata(page: Page, url: string) {
  const browser = page.context().browser();
  if (!browser) return;
  const browserName = browser.browserType().name();
  if (browserName !== "chromium") return;

  try {
    const metadata = await extractMetaTags(page);

    if (metadata.ogImage) {
      await validateOgImage(page, url, metadata.ogImage);
    }

    await snapshotMetaTags(metadata, url);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Metadata check failed for ${url}:`, error.message);
    }
  }
}

function getPathAndOutputDirname(url: string) {
  const urlPath = url.replace("http://localhost:3000", "");
  const output =
    urlPath === "/" || urlPath === ""
      ? "home"
      : urlPath.replace(/^\//, "").replace(/\//g, "-");

  return { output };
}
