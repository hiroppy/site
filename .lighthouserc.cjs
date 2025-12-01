const { COMMON } = require("./testedPaths.cjs");

module.exports = {
  ci: {
    collect: {
      url: COMMON,
      numberOfRuns: 1,
      startServerCommand: "pnpm start",
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

        // ローカル環境でのレスポンス時間のばらつきを考慮
        "document-latency-insight": "off",
        "image-delivery-insight": "off",
        "lcp-discovery-insight": "off",
        "network-dependency-tree-insight": "off",
        "forced-reflow-insight": "off",
        "unused-css-rules": "off",
        "unminified-javascript": "off",

        // pnpm previewなので不要
        "uses-text-compression": "off",

        // google slideのエラー
        "font-display": "off",
        "inspector-issues": "off",
        "third-party-cookies": "off",
        "bf-cache": "off",
        "font-display-insight": "off",
        "errors-in-console": "off",

        // next.js error
        "legacy-javascript-insight": "off",
        // TODO: 本当はonにしたい
        "unused-javascript": "off",
        // mdx
        "unsized-images": "off",

        // youtube twitter, google docs
        "total-byte-weight": "off",
        "third-party-facades": "off",
      },
    },
  },
};
