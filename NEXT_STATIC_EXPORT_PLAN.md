# Next.js static export 移行方針

## ゴールと前提

- Astro から Next.js の static export（App Router でも ISR なしの完全静的）へ段階的に移行し、公開フローを止めない。
- 画像や fetch 結果をビルド前に生成する現行キャッシュ運用（例: `generated/` 配下）を継続する。
- 並走期間は Astro と Next の出力を比較し、URL・SEO・OGP 互換性を維持する。
- UI は変えずに React コンポーネント化して再利用性とテスト容易性を高める。
- RSS/OGP/feeds など既存の生成物・機能は Next 側にも移管する。

## フェーズ別進め方

- フェーズ0: 現状棚卸し
  - ページ一覧・動的ルート・データソースとキャッシュ生成ポイント（画像ダウンロード、API fetch）を洗い出す。
  - Astro 側のビルド前スクリプトと生成物の依存関係（`generated/`、`public/`）を文書化する。
- フェーズ1: 並走基盤づくり
  - 既存コードを壊さないよう、このリポジトリ内に Next プロジェクト専用ディレクトリ（例: `next/` または `apps/next/`）を作成し、Astro と独立に動かす。`output: "export"` を設定し、`images.unoptimized: true` で static export を許容。
  - 既存の生成スクリプトを Next でも使えるよう、`pnpm generate` 的な単一コマンドで `generated/` を埋める前提に整理。生成物は `public/cache/**` など Next からも参照できる位置へ配置する。
- 共通ユーティリティ（型、日付/文字列処理、データ取得ラッパー）を `/src/shared` などに切り出し、Astro/Next の両方から使えるようにする。
- フェーズ2: ページ単位移行
  - トラフィックの少ない静的ページから Next へ移植し、`next export` の出力を Vercel/静的ホスティング上でプレビュー。差分確認用に自動スクリーンショット比較（Playwright/VRT）を用意すると安全。
  - データ取得はビルド前生成物を読む形に固定し、`fetch` は `cache: "force-cache"` + `next: { revalidate: false }` など静的前提で書き直す。
  - 画像は生成済みファイルを直接参照し、`next/image` を使う場合は `unoptimized` でバンドル。CDN 最適化が必要ならビルド後に `public/` を別途処理する。
  - 各ページ移行のたびに、OGP/構造化データ/analytics/埋め込みのパリティをチェックする。
  - UI は既存デザインを維持しつつ、プレゼンテーションとデータ取得を分離した React コンポーネントへ置き換える（Astro/Next の両方で流用可能にする）。
  - RSS/サイトマップ/フィード生成も Next 側に段階移行し、出力フォーマットと URL を固定する。
  - App Router の view transitions を段階的に有効化し、static export との両立を確認する（対応していない箇所はフォールバック可能な構成にする）。
- フェーズ3: 切り替えとクリーンアップ
  - Astro と Next のビルドを CI 上で並走させ、`dist`（Astro）と `out`（Next）を自動比較（HTML 差分・リンクチェック）。問題なければデプロイ対象を Next に切り替える。
  - 旧 Astro 用の設定やスクリプトを段階的に削除し、`generated/` のレイアウトを Next 前提に最適化する。
  - 移行完了までは本番デプロイ先を Astro 出力のまま維持し、Next 出力はプレビュー環境で確認する。

## キャッシュ/生成物の扱い

- 生成手順を Next/Astro 共通の前処理に寄せる: `pnpm generate:data && pnpm generate:images` のような形で `generated/` を完全に埋める。生成物は Git 管理しない前提で `.gitignore` を確認。
- 画像: これまで通り事前ダウンロードし、`public/cache/images/**` に配置（可能な限り事前生成）。Next 側は相対パス参照で静的配信する（`next/image` を使う場合は `unoptimized: true` を忘れない）。
- データ: fetch 結果を `generated/*.json` に保存し、Next 側は `import` または `fs` で読む。App Router を使う場合も `generateStaticParams` で事前展開する形に限定する。
- revalidate が必要な場合は、静的生成との整合を保つため「生成スクリプトを定期実行して再デプロイ」方式を選ぶ。Next の ISR は static export では使わない。

## 並走期間の確認項目

- URL/リンク互換性（trailingSlash, basePath, 国際化設定がある場合は locale）。
- `<head>` 周り（title/OGP/構造化データ/manifest）と RSS/OGP JSON など生成物の同等性。
- 画像参照パスとキャッシュヒット率。ビルドキャッシュサイズと CI 実行時間。
- 自動テスト: ルーティングの 404 チェック、リンクチェッカー、簡易 VRT を入れて差分検出を自動化。

## UI/コンポーネントとテスト方針

- UI は既存デザインを尊重し、ロジックと分離した React コンポーネントとして切り出す（props にデータを渡す純粋コンポーネント化）。
- テストは将来的に Vitest の browser mode を採用し、DOM/スタイルの挙動をブラウザ環境で検証できるようにする。サンプルコンポーネントから順にテスト追加。
- データ取得層は前処理で生成した JSON/画像を読む関数にまとめ、コンポーネントは純粋に描画のみ行う。

## MDX 移行方針

- Next.js App Router の公式ガイドに従い MDX を移行: `@next/mdx` と `next.config.js` の `experimental.mdxRs` を利用し、`app/**/page.mdx` を静的 export 前提で配置する。
- 既存の MD/MDX コンテンツはビルド前に前処理があれば Next 側でも同じ前処理を適用し、パス/slug を一致させる。

## 移行後の運用

- デプロイフローを Next のみで回し、生成スクリプト + `next export` を単一パイプラインにまとめる。
- キャッシュの破棄ポリシーを文書化（いつ生成を走らせるか、失敗時のフォールバック）。
- Astro 専用の設定/依存を削除し、Next 前提の lint/format/test 設定へ統一する。

## 決定事項

- このリポジトリ内で Next プロジェクトを追加し、Astro と並走しながら段階的に移行する。
- App Router + static export（ISR なしの完全静的）を採用する。
- 画像は可能な限り事前生成し、必要に応じて CDN 最適化を後段で検討する。
- View Transitions を App Router で対応する方針（未対応箇所はフォールバック可能にする）。
- 本番切り替えは移行完了後でよく、それまでは Astro 出力を本番、Next 出力はプレビューで確認する。

## 進捗メモ（Next 並走開始）

- `next/` ディレクトリで App Router + static export の骨組みを作成し、view transitions を有効化。
- `next/app/jobs` に初期ポートを追加し、`hiroppy/generated/jobs.json` を直接読み込む静的ページとして動作確認できる形にした（UI は Tailwind で Astro 側の見た目を近似）。
- Next 側で `externalDir` を有効化し、`@site/utils/*` と `@site/generated/*` を参照するエイリアスを追加。`next/src/shared/generated.ts` で生成物の参照を共通化。
- 将来のブラウザテスト用に `vitest.config.browser.ts` と `test:browser` スクリプトを追加（依存インストール後に利用）。
- Jobs ページのロジックを `lib.ts` に分離し、`normalizeJobs`/`formatPeriod` のブラウザテストを用意して React 化した UI をテストしやすくした。
- Next 側に Tailwind（postcss/tailwind 設定と `@tailwind` ベースの global.css）を導入し、Jobs ページの UI を Tailwind クラスで近似。
