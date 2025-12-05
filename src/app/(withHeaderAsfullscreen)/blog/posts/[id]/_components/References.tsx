"use cache";

import * as cheerio from "cheerio";
import { Link } from "../../../../../_components/Link";

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
    <section className="my-12">
      <h2 id="references" className="mb-4 text-xl font-bold text-gray-900">
        参考リンク
      </h2>
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
    </section>
  );
}

async function fetchTitle(url: string) {
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
