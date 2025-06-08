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
        "uses-responsive-images": "off",
        "lcp-lazy-loaded": "off",
        redirects: "off",
        // TODO: remove
        "label-content-name-mismatch": "off",
        "non-composited-animations": "off",
        "prioritize-lcp-image": "off",

        // playwrightで担保しているのでオフ
        "color-contrast": "off",
        "meta-viewport": "off",
      },
    },
  },
};
