import algoliasearch from "algoliasearch";
import { config } from "dotenv";
import { getArticles } from "./utils.mjs";

config();

const articles = await getArticles();
const contents = articles.map(
  ({ layout, image, tags, hatenaPath, date, ...rest }) => rest,
);
const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_ADMIN_KEY,
);
const index = client.initIndex("blog");

await index.saveObjects(contents, { autoGenerateObjectIDIfNotExist: true });
