import { readData, generateData, crawlSites } from "./utils.mjs";

const data = await crawlSites("talks");
const errors = [];

// validate
for (const talk of data) {
  if (!talk.title) {
    errors.push(talk.publishedAt);
  }
}

if (errors.length !== 0) {
  console.log(errors.join(","));
  process.exit(1);
}

// connpassのog:titleに付いている日付を消す
for (const talk of data) {
  if (talk.siteName) {
    talk.siteName = talk.siteName.replace(/\(.+?\)$/, "").trim();
  }
}

await generateData("talks", data);
