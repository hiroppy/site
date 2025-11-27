# Next preview (static export)

Astro を本番のまま維持しつつ、Next.js(App Router/`output: "export"`) 版をこのディレクトリで並走させます。view transitions 有効化済み、MDX は公式ガイド通りの構成に寄せます。

## 使い方

- インストール: `pnpm install`（ワークスペース全体で実行）
- 開発サーバー（ポート 3001）: `pnpm --filter @hiroppy/site-next dev`
- ビルド: `pnpm --filter @hiroppy/site-next build`
- 静的出力: `pnpm --filter @hiroppy/site-next export`（`next/out` に出力。`pnpm dlx serve next/out` などで確認）

## 追加済みのプレビュー

- `/` : Next 移行の方針メモ
- `/jobs` : 既存 Astro の「Skills & Work Experience」を React 化した静的ページ。`hiroppy/generated/jobs.json` を直接読み込み、UI は Tailwind ベースで近似。

## 共通アセットの参照

- `next/next.config.ts` で `externalDir: true` を許可し、ワークスペース直下の `src/utils/**` や `generated/**` を import 可能にしています。
- TypeScript alias:
  - `@site/utils/*` → `../src/utils/*`
  - `@site/generated/*` → `../generated/*`
  - `@next/shared/*` / `@site/shared/*` → `next/src/shared/*`
- `next/src/shared/generated.ts` に、`generated/` から JSON を読む小さなヘルパーを用意（完全静的向け）。

## Vitest (browser mode) の足場

- `pnpm --filter @hiroppy/site-next test:browser` で実行予定（要: `vitest`, `@vitest/browser`, `vite`, `@vitejs/plugin-react`, `playwright` をインストール）。
- 設定ファイル: `next/vitest.config.browser.ts`。React プラグインを通し、ブラウザ環境で DOM/スタイルを検証できる構成にしています。
- サンプル: `next/app/jobs/lib.test.ts` で `normalizeJobs` / `formatPeriod` をブラウザモードで検証。

## Tailwind

- `next/postcss.config.cjs` と `next/tailwind.config.ts` を追加し、`@tailwind base/components/utilities` を `app/global.css` に記述。Astro 側の tailwind とは独立に動作。

## メモ

- 画像・fetch キャッシュは従来の生成物（例: `generated/`, `public/cache/**`）を読む前提で、後続の移植時に参照パスを合わせます。
- 本番切り替えは移行完了後に行うので、当面はプレビュー確認のみ。

## RSS / OGP 生成メモ

- Astro で生成している RSS/OGP/feeds は Next 側でもビルド前スクリプトで同じ生成物を作り、`next export` で同一路径に落とす方針。
- 現行の `generated/` をソースオブトゥルースにし、差分比較（`out/rss.xml` など）で互換性を確認する。
