import { readData, generateData } from "./utils.mjs";

const data = await readData("jobs");

for (const value of Object.values(data)) {
  for (const job of value) {
    job.name = `${job.name} ${getIcon(job.position)}`.trim();
  }
}

await generateData("jobs", data);

function getIcon(position) {
  switch (position) {
    case "VPoE":
    case "technical adviser":
      return "🥸";
    case "student":
      return "👨‍🎓";
    default:
      return "";
  }
}
