import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { LOCAL_TAVILY_CACHE_DIR } from "./constants.ts";
import type { LocalTavilyCacheEntry } from "./types.ts";

/**
 * cache_key に対応するローカルキャッシュファイルパスを返す。
 *
 * Args:
 *   cacheKey: Tavily.cache_key。
 *
 * Returns:
 *   JSON ファイルの絶対パス。
 */
const toLocalCacheFilePath = (cacheKey: string): string =>
  path.join(LOCAL_TAVILY_CACHE_DIR, `${cacheKey}.json`);

/**
 * ローカル Tavily キャッシュを読み込む。
 *
 * Args:
 *   cacheKey: Tavily.cache_key。
 *
 * Returns:
 *   キャッシュエントリ。存在しないか不正な場合は null。
 */
export const readLocalTavilyCache = (
  cacheKey: string,
): LocalTavilyCacheEntry | null => {
  const filePath = toLocalCacheFilePath(cacheKey);
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      readFileSync(filePath, "utf-8"),
    ) as LocalTavilyCacheEntry;
    if (parsed.cacheKey !== cacheKey) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};
