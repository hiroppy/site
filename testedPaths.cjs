"use strict";

const { readFileSync } = require("node:fs");

// pa11y doesn't support javascript config file format
const pa11y = JSON.parse(readFileSync("./.pa11yci"));

const paths = pa11y.urls.map((path) =>
  path.replace("http://localhost:3000", "")
);

module.exports = paths;
