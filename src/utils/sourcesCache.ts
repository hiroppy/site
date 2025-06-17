import { fetchSources, type Source } from "./articlesApi";

type CacheEntry = {
  sources: Source[];
  lastHarvested?: Date;
  error?: string;
};

// メモリキャッシュ
const cache = new Map<string, CacheEntry>();

/**
 * キャッシュされたsourcesを取得、またはAPIから新規取得してキャッシュする
 */
export async function getCachedSources(
  type: string,
): Promise<{ sources: Source[]; lastHarvested?: Date; error?: string }> {
  const cached = cache.get(type);

  // キャッシュがある場合は返す
  if (cached) {
    return {
      sources: cached.sources,
      lastHarvested: cached.lastHarvested,
      error: cached.error,
    };
  }

  // APIからデータを取得
  const result = await fetchSources(type);

  // キャッシュに保存
  cache.set(type, {
    sources: result.sources,
    lastHarvested: result.lastHarvested,
    error: result.error,
  });

  return result;
}
