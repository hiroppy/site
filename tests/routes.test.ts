import { test, expect } from "@playwright/test";
import { getPathAndOutputDirname } from "./utils/getPathAndOutputDirname";
import {
  fetchWithoutRedirects,
  verifyRedirectDestination,
  fetchOGImage,
} from "./utils/routes";

test.describe("Proxy Route Tests", () => {
  test.describe("/labs/feedle redirect", () => {
    test("GET /labs/feedle returns 308 redirect", async ({ page }) => {
      const { status, headers } = await fetchWithoutRedirects(
        page,
        "/labs/feedle",
      );

      expect(status).toBe(308);
      expect(headers["location"]).toContain("/labs/feedle/frontend");
    });

    test("Redirect destination /labs/feedle/frontend loads successfully", async ({
      page,
    }) => {
      await verifyRedirectDestination(
        page,
        "/labs/feedle",
        "/labs/feedle/frontend",
      );
    });
  });

  test.describe("/blog redirect", () => {
    test("GET /blog returns 308 redirect to /blog/1", async ({ page }) => {
      const { status, headers } = await fetchWithoutRedirects(page, "/blog");

      expect(status).toBe(308);
      expect(headers["location"]).toContain("/blog/1");
    });

    test("Redirect destination /blog/1 loads successfully", async ({
      page,
    }) => {
      await verifyRedirectDestination(page, "/blog", "/blog/1");
    });
  });

  test.describe("/blog/:year redirects (year >= 2018)", () => {
    const yearTests = [
      { input: "/blog/2018", expected: "/blog/posts/2018" },
      { input: "/blog/2019", expected: "/blog/posts/2019" },
      { input: "/blog/2025", expected: "/blog/posts/2025" },
    ];

    for (const { input, expected } of yearTests) {
      test(`GET ${input} returns 308 to ${expected}`, async ({ page }) => {
        const { status, headers } = await fetchWithoutRedirects(page, input);

        expect(status).toBe(308);
        expect(headers["location"]).toContain(expected);
      });
    }
  });

  test.describe("/blog/:slug redirects (non-numeric)", () => {
    const slugTests = [
      { slug: "my-slug", expected: "/blog/posts/my-slug" },
      { slug: "vrt", expected: "/blog/posts/vrt" },
    ];

    for (const { slug, expected } of slugTests) {
      test(`GET /blog/${slug} returns 308 to ${expected}`, async ({ page }) => {
        const { status, headers } = await fetchWithoutRedirects(
          page,
          `/blog/${slug}`,
        );

        expect(status).toBe(308);
        expect(headers["location"]).toContain(expected);
      });
    }
  });

  test.describe("/blog/:page passthrough (pagination)", () => {
    const paginationPages = ["1", "2", "3", "10"];

    for (const pageNum of paginationPages) {
      test(`GET /blog/${pageNum} does NOT redirect`, async ({ page }) => {
        const { status, headers } = await fetchWithoutRedirects(
          page,
          `/blog/${pageNum}`,
        );

        expect(status).not.toBe(308);
        expect(headers["location"]).toBeUndefined();
      });
    }
  });

  test.describe("/blog/rss.xml exception", () => {
    test("GET /blog/rss.xml does NOT redirect", async ({ page }) => {
      const { status, headers } = await fetchWithoutRedirects(
        page,
        "/blog/rss.xml",
      );

      expect(status).toBe(200);
      expect(headers["location"]).toBeUndefined();
    });

    test("GET /blog/rss.xml returns XML content", async ({ page }) => {
      const response = await page
        .context()
        .request.get("http://localhost:3000/blog/rss.xml");

      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("xml");
    });
  });
});

test.describe("Blog OG Image Route Tests", () => {
  test.describe("Existing OG images", () => {
    test("GET /blog/vrt/og.png returns 200 with image/webp", async ({
      page,
    }) => {
      const { status, contentType } = await fetchOGImage(
        page,
        "/blog/vrt/og.png",
      );

      expect(status).toBe(200);
      expect(contentType).toContain("image/webp");
    });

    test("OG image screenshot matches", async ({ page }) => {
      await page.goto("http://localhost:3000/blog/vrt/og.png");

      const { output } = getPathAndOutputDirname("/blog/vrt");
      await expect(page).toHaveScreenshot([output, "og-image.png"], {
        fullPage: true,
      });
    });

    test("OG image buffer is valid", async ({ page }) => {
      const { buffer } = await fetchOGImage(page, "/blog/vrt/og.png");

      expect(buffer.byteLength).toBeGreaterThan(0);
    });
  });

  test.describe("Non-existent OG images", () => {
    test("GET /blog/nonexistent/og.png returns 404", async ({ page }) => {
      const { status } = await fetchOGImage(page, "/blog/nonexistent/og.png");

      expect(status).toBe(404);
    });

    test("GET /blog/invalid-slug/og.png returns 404", async ({ page }) => {
      const { status } = await fetchOGImage(page, "/blog/invalid-slug/og.png");

      expect(status).toBe(404);
    });
  });
});
