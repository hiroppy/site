import { getUrls } from "./utils.mjs";

const urls = await getUrls();

await Promise.allSettled(
  urls.map(async (url) => {
    await fetch(url);
    console.log("done", url);
  })
);
