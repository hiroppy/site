export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Next.js static export preview</h1>
        <p className="text-slate-600">
          Astro 版を本番に据えたまま、Next 版の UI/データ移行をこのディレクトリで進めます。
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
        <ul className="list-disc space-y-2 pl-5 text-slate-700">
          <li>App Router + output: export（ISR なし）で構築</li>
          <li>view transitions は next.config.ts で有効化済み</li>
          <li>画像・fetch キャッシュは従来の生成物を共有して参照予定</li>
          <li>MDX は公式ガイドに従い `page.mdx` で配置する方針</li>
        </ul>
      </div>
    </main>
  );
}
