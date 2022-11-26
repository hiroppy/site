import {
  crawlSites,
  readData,
  generateData,
  sortItems,
  downloadImage,
} from "./utils.mjs";
import { load } from "cheerio";

const { hot: hatenaHot } = await readData("hatena");

const hatenaRes = await fetch("https://abouthiroppy.hatenablog.jp/rss?size=100")
  .then((res) => res.text())
  .then((res) =>
    // cheerioはlinkのタグを抽出できない
    res
      .replace(/\<(link)\>/g, "<linkTag>")
      .replace(/\<\/(link)\>/g, "</linkTag>")
  );
const items = load(hatenaRes)("item").toArray();

// hatena
const platform = {
  siteName: load(hatenaRes)("channel > title").text(),
  siteUrl: load(hatenaRes)("channel > linkTag").text(),
};

const hatena = await Promise.all(
  items.map(async (item) => {
    const $ = load(item);
    const link = $("linkTag").text();

    return {
      ...platform,
      hot: hatenaHot.includes(link),
      url: link,
      title: $("title").text(),
      image: await downloadImage($("enclosure").attr("url")),
      publishedAt: `${new Date($("pubDate").text()).toISOString()}`.split(
        "T"
      )[0],
    };
  })
);

const allArticles = sortItems([...(await crawlSites("articles")), ...hatena]);

for (const article of allArticles) {
  if (article.hot) {
    const { host, pathname } = new URL(article.url);
    const isHatena = host === "abouthiroppy.hatenablog.jp";
    const hostname = isHatena ? "blog.hiroppy.me" : host;

    article.bookmark = await getBookmark(`https://${hostname}${pathname}`);

    if (isHatena) {
      const newPathname = pathname.replace("/entry", "");

      article.url = `https://hiroppy.me/blog${newPathname}`;
    }
  }
}

await generateData("articles", allArticles);

async function getBookmark(entry) {
  const url = `https://b.hatena.ne.jp/entry/json/${entry}`;
  const res = await fetch(url).then((res) => res.json());

  return res.count;
}
