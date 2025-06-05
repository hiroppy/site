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
        // Image optimization improvements allow for better LCP thresholds
        "largest-contentful-paint": ["warn", { minScore: 0.6 }], // Improved from 0.51 baseline
        interactive: ["warn", { minScore: 0.85 }], // Slightly better threshold
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
        redirects: "off",
        // TODO: need to consider design
        "link-in-text-block": "off",
        "total-byte-weight": "off",
        "label-content-name-mismatch": "off",
        // TODO: remove
        "tap-targets": "off",
        "color-contrast": "off", // Design system limitation - needs design review
        "non-composited-animations": "off",
        "prioritize-lcp-image": "off",
        "meta-viewport": "off",
      },
    },
  },
};
