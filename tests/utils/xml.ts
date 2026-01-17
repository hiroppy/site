import { expect, Page } from "@playwright/test";
import { load } from "cheerio";

export async function fetchXml(page: Page, path: string) {
  const response = await page
    .context()
    .request.get(`http://localhost:3000${path}`);

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"] || "").toContain("xml");

  const xml = await response.text();
  expect(xml.trim().length).toBeGreaterThan(0);

  return xml;
}

export function parseSitemap(xml: string) {
  const $ = load(xml, { xmlMode: true });
  const locs = $("url > loc")
    .map((_, el) => $(el).text())
    .get();

  return { locs };
}

export function normalizeLoc(loc: string) {
  const match = loc.match(/^(https?:\/\/[^/]+)(.*)$/);

  if (!match) return loc;

  const [, origin, path] = match;

  if (path && !path.startsWith("/")) {
    return `${origin}/${path}`;
  }

  return `${origin}${path}`;
}

export function parseRss(xml: string) {
  const $ = load(xml, { xmlMode: true });
  const channelTitle = $("channel > title").first().text();
  const channelLink = $("channel > link").first().text();
  const items = $("channel > item")
    .map((_, el) => ({
      title: $(el).find("title").text(),
      link: $(el).find("link").text(),
      description: $(el).find("description").text(),
    }))
    .get();

  return {
    channelTitle,
    channelLink,
    items,
  };
}
