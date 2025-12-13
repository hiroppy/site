export function parseTags(tags: string) {
  return tags.split(",").map((v) => v.trim());
}
