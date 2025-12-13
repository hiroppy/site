import { expect, Page } from "@playwright/test";
import { getPathAndOutputDirname } from "./getPathAndOutputDirname";

type MetadataSnapshot = {
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
};

export async function checkMetadata(page: Page, url: string) {
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
  const ogImageFullUrl = ogImageUrl;
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

  // Remove query parameters from image URLs to prevent snapshot mismatches
  const normalizedMetadata = {
    ...metadata,
    ogImage: metadata.ogImage ? metadata.ogImage.split("?")[0] : null,
    twitterImage: metadata.twitterImage
      ? metadata.twitterImage.split("?")[0]
      : null,
  };

  const metadataJson = JSON.stringify(normalizedMetadata, null, 2);

  expect(metadataJson).toMatchSnapshot([output, "metadata.json"]);
}
