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
        // for partytown
        deprecations: "off",
        // no js
        "csp-xss": "off",
        "render-blocking-resources": ["error", { maxLength: 4 }],
        "uses-responsive-images": "off",
        // for twitter card
        "unused-javascript": "off",
        // for article page
        "unsized-images": "off",
      },
    },
  },
};
