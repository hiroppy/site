import {
  crawlSites,
  readData,
  generateData,
  sortItems,
  downloadImage,
} from "./utils.mjs";
import ParseFeed from "rss-parser";
import { fetch } from "undici";

const { hot: hatenaHot } = await readData("hatena");

// hatena
const parse = new ParseFeed({
  customFields: {
    item: [],
  },
});
const res = await parse.parseURL("https://blog.hiroppy.me/rss?size=100");
const platform = {
  siteName: res.title,
  siteUrl: res.link,
};
const hatena = await Promise.all(
  res.items.map(async ({ title, link, enclosure, isoDate, categories }) => ({
    ...platform,
    hot: hatenaHot.includes(link),
    url: link,
    title,
    image: await downloadImage(enclosure.url),
    publishedAt: `${isoDate}`.split("T")[0],
    category: categories?.includes("life")
      ? "life"
      : categories?.includes("JavaScript") ||
        categories?.includes("Node") ||
        categories?.includes("webpack") ||
        categories?.includes("GitHub")
      ? "tech"
      : "",
  }))
);

await getBookmark("https://hiroppy.me");

const allArticles = sortItems([...(await crawlSites("articles")), ...hatena]);

for (const article of allArticles) {
  if (article.hot) {
    article.bookmark = await getBookmark(article.url);
  }
}

await generateData("articles", allArticles);

async function getBookmark(entry) {
  const url = `https://b.hatena.ne.jp/entry/json/${entry}`;
  const res = await fetch(url).then((res) => res.json());

  return res.count;
}
