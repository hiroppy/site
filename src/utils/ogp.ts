import { load } from "cheerio";

export type OGPData = {
  title: string;
  description: string;
  image: string;
};

export async function fetchOGP(url: string): Promise<OGPData> {
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

  return { title, description, image };
}
