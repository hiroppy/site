const paths = require("./testedPaths.cjs");

module.exports = {
  ci: {
    collect: {
      url: paths,
      numberOfRuns: 1,
      startServerCommand: "pnpm preview --port 3000",
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

        // ローカル環境でのレスポンス時間のばらつきを考慮
        "document-latency-insight": "off",
        "image-delivery-insight": "off",
        "lcp-discovery-insight": "off",
        "network-dependency-tree-insight": "off",
        "forced-reflow-insight": "off",
        "unused-css-rules": "off",

        // pnpm previewなので不要
        "uses-text-compression": "off",
      },
    },
  },
};
