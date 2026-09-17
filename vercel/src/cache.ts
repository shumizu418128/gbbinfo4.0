import { cacheKey } from "./normalize.js";

type CacheEntry = {
  path: string;
  confidence: number;
  expiresAt: number;
};

const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 500;

const store = new Map<string, CacheEntry>();

const evictExpired = (now: number): void => {
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) {
      store.delete(key);
    }
  }
};

const evictOldest = (): void => {
  while (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest === undefined) {
      return;
    }
    store.delete(oldest);
  }
};

/**
 * キャッシュから検索結果を取る。
 *
 * Args:
 *   lang: 表示言語。
 *   year: ページ上の年。
 *   query: 生クエリ。
 *
 * Returns:
 *   ヒットした path と confidence。なければ null。
 */
export const getCachedSearch = (
  lang: string,
  year: number,
  query: string,
): { path: string; confidence: number } | null => {
  const now = Date.now();
  evictExpired(now);
  const entry = store.get(cacheKey(lang, year, query));
  if (entry === undefined || entry.expiresAt <= now) {
    if (entry !== undefined) {
      store.delete(cacheKey(lang, year, query));
    }
    return null;
  }
  return { path: entry.path, confidence: entry.confidence };
};

/**
 * 検索結果をキャッシュする。
 *
 * Args:
 *   lang: 表示言語。
 *   year: ページ上の年。
 *   query: 生クエリ。
 *   path: 選出したパス。
 *   confidence: TypeSafe の confidence。
 */
export const setCachedSearch = (
  lang: string,
  year: number,
  query: string,
  path: string,
  confidence: number,
): void => {
  const now = Date.now();
  evictExpired(now);
  evictOldest();
  store.set(cacheKey(lang, year, query), {
    path,
    confidence,
    expiresAt: now + TTL_MS,
  });
};
