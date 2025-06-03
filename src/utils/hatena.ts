/**
 * Get bookmark count from Hatena Bookmark
 * @param entry - URL to get bookmark count for
 * @returns Promise<number> - Bookmark count
 */
export async function getBookmark(entry: string): Promise<number> {
  try {
    const url = `https://b.hatena.ne.jp/entry/json/${entry}/`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = (await res.json()) as { count?: number };
    return data.count || 0;
  } catch (error) {
    console.error(`Failed to fetch bookmark for ${entry}:`, error);
    return 0;
  }
}
