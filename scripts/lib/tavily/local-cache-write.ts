import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { LOCAL_TAVILY_CACHE_DIR } from "../../../shared/tavily/constants.ts";
import type { LocalTavilyCacheEntry } from "../../../shared/tavily/types.ts";

/**
 * cache_key に対応するローカルキャッシュファイルパスを返す。
 */
const toLocalCacheFilePath = (cacheKey: string): string =>
  path.join(LOCAL_TAVILY_CACHE_DIR, `${cacheKey}.json`);

/**
 * ローカル Tavily キャッシュを書き込む（sync スクリプト用）。
 *
 * Args:
 *   entry: 保存するキャッシュエントリ。
 */
export const writeLocalTavilyCache = (entry: LocalTavilyCacheEntry): void => {
  mkdirSync(LOCAL_TAVILY_CACHE_DIR, { recursive: true });
  const filePath = toLocalCacheFilePath(entry.cacheKey);
  writeFileSync(
    filePath,
    `${JSON.stringify({ ...entry, updatedAt: new Date().toISOString() }, null, 2)}\n`,
    "utf-8",
  );
};

/**
 * ローカルキャッシュが Tavily 同期完了状態か判定する。
 *
 * Args:
 *   entry: ローカルキャッシュエントリ。
 *
 * Returns:
 *   answer と ja/ko 翻訳が揃っていれば true。
 */
export const isLocalTavilyCacheComplete = (
  entry: LocalTavilyCacheEntry,
): boolean => {
  const answer = (entry.searchResults as { answer?: string | null }).answer;
  if (answer == null || answer === "") {
    return false;
  }
  return Boolean(entry.answerTranslation.ja && entry.answerTranslation.ko);
};
