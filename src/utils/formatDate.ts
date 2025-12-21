export function formatDateJapanese(
  date: string | Date,
  format: "short" | "long" = "short",
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (format === "short") {
    return dateObj
      .toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour12: false,
      })
      .replace(/\//g, "-");
  }

  return dateObj
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace("年", "年 ")
    .replace("月", "月 ")
    .replace("日", "日 ");
}

export function isRecentDate(publishedAt?: string): boolean {
  if (!publishedAt) return false;

  const publishedDate = new Date(publishedAt);
  const oneMonthAgo = new Date();

  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return publishedDate >= oneMonthAgo;
}
