export const commonStyles = {
  // フォーカス状態
  focusRing:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",

  // ナビゲーション
  navItem: "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
  navActive: "bg-blue-600 text-white shadow-sm",
  navDefault:
    "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800",

  // カード
  cardBase:
    "rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800",
  cardInteractive: "overflow-hidden border-0 shadow-md card-lift",

  // 入力
  inputBase:
    "border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600",

  // パディング
  cardHeader: "flex flex-col space-y-1.5 p-6",
  cardContent: "p-4 md:p-6",

  // テキスト
  textPrimary: "text-gray-700 dark:text-gray-300",
  textSecondary: "text-gray-500 dark:text-gray-400",
  textInverse: "text-white",
} as const;
