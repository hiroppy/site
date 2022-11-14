module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: ["/", "/media", "/blog", "/blog/vrt"],
      numberOfRuns: 1,
    },
    assert: {
      preset: "lighthouse:no-pwa",
      assertions: {
        // for partytown
        deprecations: "off",
        // no js
        "csp-xss": "off",
        "render-blocking-resources": ["error", { maxLength: 2 }],
        "uses-responsive-images": "off",
        // for twitter card
        "unused-javascript": "off",
        // a blog page doesn't convert to webp
        "uses-optimized-images": "off",
      },
    },
  },
};
