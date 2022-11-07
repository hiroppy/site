import { readData, generateData, crawlSites } from "./utils.mjs";

// const data = await readData("talks");

const data = await crawlSites("talks");

console.log(data);

// validate
for (const slide of data) {
  if (!slide.title) {
    console.error(slide.publishedAt, "title not found");
  }
}
