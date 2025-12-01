export const commonStyles = {
  focusRing:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
  navItem: "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
  navActive: "bg-blue-600 text-white shadow-sm",
  navDefault: "text-gray-700 hover:bg-gray-200",
  cardBase: "rounded border bg-bg",
  cardInteractive: "overflow-hidden",
  inputBase:
    "border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
  cardHeader: "flex flex-col space-y-1.5 p-6",
  cardContent: "p-4 md:p-6",
} as const;
