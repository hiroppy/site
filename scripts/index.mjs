await Promise.all([
  import("./achievements.mjs"),
  import("./articles.mjs"),
  import("./jobs.mjs"),
  import("./podcasts.mjs"),
  import("./repos.mjs"),
  import("./talks.mjs"),
  import("./sponsors.mjs"),
]);
