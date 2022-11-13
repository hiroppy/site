import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { fetch } from "undici";
import { load } from "cheerio";

const xml = await readFile(
  join(fileURLToPath(import.meta.url), "../../dist/sitemap-0.xml"),
  "utf-8"
);

const $ = load(xml);
const urls = $("url loc")
  .toArray()
  .map((el) => el.children[0].data);

await Promise.allSettled(
  urls.map(async (url) => {
    await fetch(url);
    console.log("done", url);
  })
);
