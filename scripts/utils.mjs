import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import { load } from "cheerio";
import ParseFeed from "rss-parser";

export const baseDataPath = join(fileURLToPath(import.meta.url), "../../data");
export const generatedDataPath = join(
  fileURLToPath(import.meta.url),
  "../../generated"
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

// 取得したものはsiteのキーの中にいれて、判断はキーが有るか行う
export async function crawlSites(filename) {
  const promisifyExec = promisify(exec);
  const sites = await collectAlreadyHavingSites(filename);
  const data = await readData(filename);
  const promises = data.map(
    async ({ url, comment, publishedAt, appendixes, hot, title }) => {
      const memo = sites.find(({ url: memoedUrl }) => memoedUrl === url);

      if (memo) {
        console.log("memo", url);
        return memo;
      } else {
        console.log("new", url);
      }

      // twitterはbotをつけないとogをつけない
      // nodeライブラリは基本、user-agentを変えれない
      const { stdout: html } = await promisifyExec(
        `curl '${url}' -H 'User-Agent: bot'`
      );

      const $ = load(html);
      const og = {
        title: title ?? $("meta[property='og:title']").attr("content"),
        description: $("meta[property='og:description']").attr("content"),
        image: $("meta[property='og:image']").attr("content"),
        siteName: $("meta[property='og:site_name']").attr("content"),
      };

      return {
        ...og,
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
