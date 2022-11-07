import { crawlSites, generateData, sortItems } from "./utils.mjs";

const data = await crawlSites("achievements");

generateData("achievements", sortItems(data));
