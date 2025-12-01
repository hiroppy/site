"use cache";

import { load } from "cheerio";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { MdOpenInNew } from "react-icons/md";
import { Image } from "../../components/Image";
import { Link } from "../../components/Link";

type Props = {
  url: string;
};

export async function OG({ url }: Props) {
  const { title, description, image } = await fetchOGP(url);

  return (
    <Link
      href={url}
      aria-label={title}
      unstyled
      className="group my-6 block overflow-hidden rounded-lg border border-gray-200 transition-all duration-200 hover:border-accent hover:shadow-md hover:no-underline"
    >
      <div className="flex h-32">
        <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
          <div>
            <h3 className="mt-0 mb-2 line-clamp-2 text-base leading-tight font-medium text-gray-900">
              {title}
            </h3>
            {description && (
              <p className="mt-0 truncate text-sm text-gray-600">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <MdOpenInNew
              className="text-gray-400"
              size={14}
              aria-hidden="true"
              focusable="false"
            />
            <span className="truncate text-xs text-gray-500">
              {new URL(url).hostname}
            </span>
          </div>
        </div>
        {image && (
          <div className="w-24 shrink-0 overflow-hidden md:w-[243px]">
            <Image
              src={image}
              alt={title}
              width={243}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </Link>
  );
}

type OGPData = {
  title: string;
  description: string;
  image: string;
};

type OGPCache = {
  [url: string]: OGPData;
};

async function fetchOGP(url: string): Promise<OGPData> {
  const generatedFilePath = resolve(process.cwd(), "generated/ogp.json");
  let ogpCache: OGPCache = {};

  try {
    const content = readFileSync(generatedFilePath, "utf8");
    ogpCache = JSON.parse(content);
  } catch {
    // File doesn't exist or is invalid
  }

  if (ogpCache[url]) {
    return ogpCache[url];
  }

  let title = "";
  let description = "";
  let image = "";

  try {
    const html = await fetch(url).then((res) => res.text());
    const $ = load(html);

    title = $("meta[property='og:title']").attr("content") ?? $("title").text();
    description =
      $("meta[property='og:description']").attr("content") ??
      $("meta[name='description']").attr("content") ??
      "";
    image = $("meta[property='og:image']").attr("content") ?? "";

    if (image && !image.startsWith("http")) {
      const urlObj = new URL(url);
      image = `${urlObj.origin}${image.startsWith("/") ? "" : "/"}${image}`;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`Failed to fetch OG data for ${url}:`, error.message);
    }

    title = url;
    description = "";
    image = "";
  }

  // Cache the result in production
  if (process.env.NODE_ENV === "production") {
    try {
      writeFileSync(
        generatedFilePath,
        JSON.stringify(
          {
            ...ogpCache,
            [url]: { title, description, image },
          },
          null,
          2,
        ),
      );
    } catch (error) {
      console.warn("Failed to write OGP cache:", error);
    }
  }

  return { title, description, image };
}
