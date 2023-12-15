const paths = require("./testedPaths.cjs");

module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: paths,
      numberOfRuns: 1,
    },
    assert: {
      preset: "lighthouse:no-pwa",
      assertions: {
        // no js
        "csp-xss": "off",
        "uses-responsive-images": "off",
        // for twitter card
        "unused-javascript": "off",
        // for article page
        "bf-cache": "off",
        // the default of astro image component
        "lcp-lazy-loaded": "off",
        "image-aspect-ratio": "off",
      },
    },
  },
};
