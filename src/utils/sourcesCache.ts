import { fetchSources, type Source } from "./articlesApi";

type CacheEntry = {
  sources: Source[];
  lastHarvested?: Date;
  error?: string;
  timestamp: number;
};

// メモリキャッシュ
const cache = new Map<string, CacheEntry>();

// キャッシュの有効期限（5分）
const CACHE_TTL = 5 * 60 * 1000;

/**
 * キャッシュされたsourcesを取得、またはAPIから新規取得してキャッシュする
 */
export async function getCachedSources(
  type: string,
): Promise<{ sources: Source[]; lastHarvested?: Date; error?: string }> {
  // 開発環境ではキャッシュを無効化
  if (import.meta.env.DEV) {
    return await fetchSources(type);
  }

  const cached = cache.get(type);
  const now = Date.now();

  // キャッシュがあり、有効期限内の場合は返す
  if (cached && now - cached.timestamp < CACHE_TTL) {
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
    timestamp: now,
  });

  return result;
}
