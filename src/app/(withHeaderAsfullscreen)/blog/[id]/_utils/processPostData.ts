import type { HeadingData } from "../../../../../mdx/contentLoader";

export function processHeadingsWithReferences(
  extractedHeadings: HeadingData[],
  hasReferences: boolean,
): HeadingData[] {
  const headings = [...extractedHeadings];

  if (hasReferences) {
    headings.push({ depth: 2, slug: "references", text: "参考リンク" });
  }

  return headings;
}

export function calculateDateInfo(date: Date) {
  const now = new Date();
  const diffDate = (now.getTime() - date.getTime()) / (60 * 60 * 1000 * 24);

  return {
    diffDate,
    isOld: diffDate > 365,
  };
}
