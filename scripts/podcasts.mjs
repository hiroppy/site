import { crawlSites, generateData } from "./utils.mjs";

const data = await crawlSites("podcasts");

generateData("podcasts", data);
