import { join } from "node:path";
import { createWriteStream } from "node:fs";
import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import { load } from "cheerio";
import ParseFeed from "rss-parser";
import { stream } from "undici";

const promisifyExec = promisify(exec);

export const baseDataPath = join(fileURLToPath(import.meta.url), "../../data");
export const generatedDataPath = join(
  fileURLToPath(import.meta.url),
  "../../generated"
);
export const baseImageOutputPath = join(
  fileURLToPath(import.meta.url),
  "../../public/images/external"
);

export async function readData(filename, original = true) {
  const data = await readFile(
    join(original ? baseDataPath : generatedDataPath, `${filename}.json`),
    "utf-8"
  );

  return JSON.parse(data);
}

export async function generateData(filename, data) {
  await writeFile(
    join(generatedDataPath, `${filename}.json`),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

export async function collectAlreadyHavingSites(filename) {
  try {
    return await readData(filename, false);
  } catch (e) {
    return [];
  }
}

export async function getMeta(url, title) {
  // twitterはbotをつけないとogをつけない
  // nodeライブラリは基本、user-agentを変えれない
  const { stdout: html } = await promisifyExec(
    `curl '${url}' -H 'User-Agent: bot'`
  );

  const $ = load(html);

  return {
    title: title ?? $("meta[property='og:title']").attr("content"),
    description: $("meta[property='og:description']").attr("content"),
    image: $("meta[property='og:image']").attr("content"),
    siteName: $("meta[property='og:site_name']").attr("content"),
  };
}

// 取得したものはsiteのキーの中にいれて、判断はキーが有るか行う
export async function crawlSites(filename) {
  const sites = await collectAlreadyHavingSites(filename);
  const data = await readData(filename);
  const promises = data.map(
    async ({ url, comment, publishedAt, appendixes, hot, title, siteName }) => {
      const memo = sites.find(({ url: memoedUrl }) => memoedUrl === url);

      if (memo) {
        console.log("memo", url);
        return memo;
      } else {
        console.log("new", url);
      }

      const meta = await getMeta(url, title);

      if (siteName?.startsWith("http")) {
        const site = await getMeta(siteName);

        meta.siteName = site.title;
        meta.siteUrl = siteName;
      } else if (siteName) {
        meta.siteName = siteName;
      }

      if (meta.image) {
        meta.image = await downloadImage(meta.image);
      }

      return {
        ...meta,
        url,
        hot,
        comment,
        publishedAt,
        appendixes,
      };
    }
  );

  return await Promise.all(promises);
}

export function sortItems(items) {
  return items.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function downloadImage(url) {
  if (!url) {
    return "";
  }

  const ext = url.includes(".jpg")
    ? ".jpg"
    : url.includes(".jpeg")
    ? ".jpg"
    : url.includes(".png")
    ? ".png"
    : url.includes(".webp")
    ? ".webp"
    : url.includes(".gif")
    ? ".gif"
    : ".png";
  const filename = `${Buffer.from(url.replace(/https?:\/\//, ""))
    .toString("base64")
    .replace("/", "_")
    .slice(0, 90)}${ext}`;
  const fullPath = `/images/external/${filename}`;
  const assets = await readdir(baseImageOutputPath);

  if (assets.includes(filename)) {
    return fullPath;
  }

  await stream(url, { throwOnError: true }, () =>
    createWriteStream(join(baseImageOutputPath, filename))
  );

  return fullPath;
}
