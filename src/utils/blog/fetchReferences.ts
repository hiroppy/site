import * as cheerio from "cheerio";
import type { Reference } from "../../components/blog/References";

async function fetchTitle(url: string): Promise<string | null> {
  if (process.env.NODE_ENV === "development") {
    return "---- dev mode ----";
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const title = $("title").text().trim();
    return title || null;
  } catch (error) {
    console.error(`Failed to fetch title for ${url}:`, error);
    return null;
  }
}

export async function fetchReferences(
  references: string[],
): Promise<Reference[]> {
  return Promise.all(
    references.map(async (url) => {
      const title = await fetchTitle(url);
      return { url, title: title || url };
    }),
  );
}
