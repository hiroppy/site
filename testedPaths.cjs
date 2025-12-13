"use strict";

const COMMON = [
  "http://localhost:3000/",
  "http://localhost:3000/about",
  "http://localhost:3000/jobs",
  "http://localhost:3000/blog/tags/site",
  "http://localhost:3000/blog/posts/vrt",
  "http://localhost:3000/media/articles",
  "http://localhost:3000/labs",
];

const METADATA_URLS = [
  ...COMMON,
  "http://localhost:3000/media/all",
  "http://localhost:3000/media/talks",
  "http://localhost:3000/media/podcasts",
  "http://localhost:3000/blog/2",
  // "http://localhost:3000/labs/feedle/frontend",
];

const VRT_URLS = [...COMMON, "http://localhost:3000/blog/posts/404"];

module.exports = {
  COMMON,
  METADATA_URLS,
  VRT_URLS,
};
