/**
 * Generic date-based sorting utility
 * Sorts items by date in descending order (newest first)
 */
export function sortByDate<T>(
  items: T[],
  dateGetter: (item: T) => Date | string,
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(dateGetter(a));
    const dateB = new Date(dateGetter(b));
    return dateB.getTime() - dateA.getTime();
  });
}
