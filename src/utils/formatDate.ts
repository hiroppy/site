export function formatDate(date: Date) {
  const parsed = Object.fromEntries(
    new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, value])
  );

  return `${parsed.year} ${parsed.literal} ${parsed.month} ${parsed.literal} ${parsed.day}`;
}
