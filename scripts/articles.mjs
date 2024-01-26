import { load } from "cheerio";
import {
  crawlSites,
  readData,
  generateData,
  sortItems,
  downloadImage,
  getArticles,
} from "./utils.mjs";

const { hot: hatenaHot } = await readData("hatena");
const baseUrl = "https://hiroppy.me";

// hatena
const hatenaArticles = await parseRss(
  "https://abouthiroppy.hatenablog.jp/rss?size=100",
  undefined,
  false,
);

// hiroppy.me
const blogArticles = (await getArticles())
  .filter(
    ({ date }) => new Date("2022-11-17").getTime() <= new Date(date).getTime(),
  )
  .map(({ path, title, image, description, date }) => ({
    siteName: "hiroppy's Blog",
    siteUrl: `${baseUrl}/blog/`,
    // TODO: fix
    hot: false,
    url: `${baseUrl}/${path}/`,
    title,
    image,
    description,
    publishedAt: date,
  }));

const allArticles = sortItems([
  ...(await crawlSites("articles")),
  ...hatenaArticles,
  ...blogArticles,
]);

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
    if (
      article.url ===
      "https://engineering.mercari.com/blog/entry/20210823-a57631d32e/"
    ) {
      article.image =
        "/images/external/c3RvcmFnZS5nb29nbGVhcGlzLmNvbS9wcmQtZW5naW5lZXJpbmctYXNzZXQvMjAyMS8wOC9lM2VlZTY0NS1oaXJvcH.png";
      article.title = "メルカリShops のフロントエンド";
    }
  }
}

await generateData("articles", allArticles);

async function getBookmark(entry) {
  const url = `https://b.hatena.ne.jp/entry/json/${entry}`;
  const res = await fetch(url).then((res) => res.json());

  return res.count;
}

function removeCData(str) {
  const [, res] = str.match(/<!\[CDATA\[(.+?)\]\]>/) ?? [];

  return res ?? str;
}

async function parseRss(url, skippingConditionDate, isShowDescription = true) {
  const res = await fetch(url)
    .then((res) => res.text())
    .then((res) =>
      // cheerioはlinkのタグを抽出できない
      res
        .replace(/\<(link)\>/g, "<linkTag>")
        .replace(/\<\/(link)\>/g, "</linkTag>"),
    );
  const platform = {
    siteName: removeCData(load(res)("channel > title").text()),
    siteUrl: load(res)("channel > linkTag").text(),
  };
  const items = (
    await Promise.all(
      load(res)("item")
        .toArray()
        .map(async (item) => {
          const $ = load(item);
          const link = $("linkTag").text();
          const publishedAt = `${new Date(
            $("pubDate").text(),
          ).toISOString()}`.split("T")[0];

          if (
            skippingConditionDate &&
            new Date(publishedAt) < new Date(skippingConditionDate)
          ) {
            return false;
          }

          return {
            ...platform,
            hot: hatenaHot.includes(link),
            url: link,
            title: removeCData($("title").text()),
            image: await downloadImage($("enclosure").attr("url")),
            description: isShowDescription
              ? removeCData($("description").text())
              : "",
            publishedAt,
          };
        }),
    )
  ).filter(Boolean);

  return items;
}
