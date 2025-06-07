import { algoliasearch } from "algoliasearch";
import { getArticles } from "./utils.mts";

process.loadEnvFile();

const articles = await getArticles();
const contents = articles.map(
  ({ layout, image, tags, hatenaPath, date, ...rest }) => rest,
);
const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID!,
  process.env.ALGOLIA_ADMIN_KEY!,
);

await client.saveObjects({
  indexName: "blog",
  objects: contents,
});
