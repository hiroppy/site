export function sortItems(arr: DataItem[]) {
  return arr.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
