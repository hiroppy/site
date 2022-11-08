import { readData, generateData, crawlSites } from "./utils.mjs";

const data = await crawlSites("talks");
const errors = [];

// validate
for (const slide of data) {
  if (!slide.title) {
    errors.push(slide.publishedAt);
  }
}

if (errors.length !== 0) {
  console.log(errors.join(","));
  process.exit(1);
}

await generateData("talks", data);
