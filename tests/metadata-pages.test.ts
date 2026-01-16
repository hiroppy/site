import { test, expect } from "@playwright/test";
import { COMMON, METADATA_URLS } from "../testedPaths.cjs";
import { checkMetadata } from "./utils/metadata";
import { fetchXml, normalizeLoc, parseRss, parseSitemap } from "./utils/xml";

test.describe("Page Metadata Tests", () => {
  for (const url of METADATA_URLS) {
    test(url, async ({ page }, testInfo) => {
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
});

test.describe("sitemap/rss", () => {
  // TODO: need to investigate
  test.skip("Sitemap exposes main URLs", async ({ page }) => {
    const xml = await fetchXml(page, "/sitemap.xml");
    const { locs } = parseSitemap(xml);
    const normalizedLocs = locs.map(normalizeLoc);

    expect(xml).toContain("<urlset");
    expect(normalizedLocs.length).toBeGreaterThan(0);

    expect(
      COMMON.every((segment) => normalizedLocs.some((loc) => loc === segment)),
    ).toBeTruthy();
  });

  test("Blog RSS is generated with posts", async ({ page }) => {
    const xml = await fetchXml(page, "/blog/rss.xml");
    const { channelTitle, channelLink, items } = parseRss(xml);

    expect(xml).toContain("<rss");
    expect(xml).toContain("<channel>");
    expect(channelTitle).toBe("技術探し");
    expect(channelLink).toBe("https://hiroppy.me/blog");
    expect(items.length).toBeGreaterThan(0);

    // Verify that all item links have correct URL format (/blog/posts/)
    for (const item of items) {
      expect(item.link).toMatch(/^https:\/\/hiroppy\.me\/blog\/posts\/.+$/);
      expect(item.link).not.toContain("/blogposts/");
    }
  });

  test("Feedle RSS returns frontend feed", async ({ page }) => {
    const xml = await fetchXml(page, "/labs/feedle/frontend/rss.xml");
    const { channelTitle, channelLink, items } = parseRss(xml);

    expect(xml).toContain("<rss");
    expect(channelTitle).toBe("Feedle - Frontend");
    expect(channelLink).toBe("https://hiroppy.me/labs/feedle/frontend");
    expect(items.length).toBeGreaterThan(0);
  });

  test("Feedle RSS generates valid XML without entity errors", async ({
    page,
  }) => {
    const xml = await fetchXml(page, "/labs/feedle/frontend/rss.xml");

    // Parse XML to ensure it's valid (parseRss will throw if invalid)
    const { channelTitle, items } = parseRss(xml);

    expect(channelTitle).toBeTruthy();
    expect(items.length).toBeGreaterThan(0);

    // Remove CDATA sections before checking for unescaped entities
    // CDATA content can contain literal & characters without escaping
    const xmlWithoutCDATA = xml.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "");

    // Verify no unescaped & characters in XML (outside of CDATA)
    // This regex matches & followed by anything that's NOT a valid XML entity
    // Valid entities: &amp; &lt; &gt; &quot; &apos; &#123; &#xABC;
    const invalidEntities = xmlWithoutCDATA.match(
      /&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g,
    );
    expect(invalidEntities).toBeNull();
  });

  test("Feedle RSS with kind parameter generates valid XML", async ({
    page,
  }) => {
    const xml = await fetchXml(
      page,
      "/labs/feedle/frontend/rss.xml?kind=community",
    );

    // Parse XML to ensure it's valid
    const { channelTitle, items } = parseRss(xml);

    expect(channelTitle).toContain("Community");
    expect(items.length).toBeGreaterThan(0);

    // Remove CDATA sections before checking for unescaped entities
    const xmlWithoutCDATA = xml.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "");

    // Verify no unescaped & characters (outside of CDATA)
    const invalidEntities = xmlWithoutCDATA.match(
      /&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g,
    );
    expect(invalidEntities).toBeNull();
  });
});
