// TODO
export function sortItems(arr: any[]) {
  return arr.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
