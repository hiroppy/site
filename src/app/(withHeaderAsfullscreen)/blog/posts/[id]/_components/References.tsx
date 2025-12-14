"use cache";

import * as cheerio from "cheerio";
import { Link } from "../../../../../../components/Link";

type Props = {
  references: string[];
};

export async function References({ references }: Props) {
  if (references.length === 0) {
    return null;
  }

  const referencesWithTitles = await Promise.all(
    references.map(async (url) => {
      const title = await fetchTitle(url);

      return { url, title: title ?? url };
    }),
  );

  return (
    <>
      <h2 id="references">Stuff</h2>
      <ul className="list-outside list-disc space-y-1">
        {referencesWithTitles.map(({ url, title }, index) => (
          <li key={`${url}-${index}`} className="ml-4 marker:text-gray-700">
            <Link
              href={url}
              unstyled
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

async function fetchTitle(url: string) {
  if (process.env.NODE_ENV === "development") {
    return "---- dev mode ----";
  }

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      console.warn(`Failed to fetch title for ${url}: HTTP ${response.status}`);
      return getFallbackTitle(url);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const title = $("title").text().trim();
    return title || getFallbackTitle(url);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to fetch title for ${url}:`, errorMessage);
    return getFallbackTitle(url);
  }
}

function getFallbackTitle(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}
