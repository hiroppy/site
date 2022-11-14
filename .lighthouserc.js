module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: ["/", "/media", "/blog", "/blog/join-yuimedi"],
      numberOfRuns: 1,
    },
    assert: {
      preset: "lighthouse:no-pwa",
    },
  },
};
