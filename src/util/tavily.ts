import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { AnswerTranslation } from "~/db/tavily.js";

export type LocalTavilyCacheEntry = {
  cacheKey: string;
  beatboxerName: string;
  searchResults: Record<string, unknown>;
  answerTranslation: AnswerTranslation;
  updatedAt: string;
};

/** ローカル Tavily キャッシュ（gitignore）。 */
export const LOCAL_TAVILY_CACHE_DIR = path.join(process.cwd(), ".cache/tavily");

/**
 * 出場者名から Tavily キャッシュキーを生成する（3.0 互換）。
 *
 * Args:
 *   beatboxerName: 出場者名。
 *
 * Returns:
 *   `tavily_search_{sanitized}` 形式のキー。
 */
export const toTavilyCacheKey = (beatboxerName: string): string =>
  `tavily_search_${beatboxerName.trim().replace(/[^a-zA-Z0-9_-]/g, "_")}`;

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
 * `.cache/tavily` に存在する Beatboxer 名一覧を返す。
 *
 * Returns:
 *   大文字正規化済みの名前一覧。
 */
export const getCachedBeatboxerNames = (): Set<string> => {
  if (!existsSync(LOCAL_TAVILY_CACHE_DIR)) {
    return new Set();
  }

  const names = new Set<string>();
  for (const file of readdirSync(LOCAL_TAVILY_CACHE_DIR)) {
    if (!file.endsWith(".json")) {
      continue;
    }
    try {
      const parsed = JSON.parse(
        readFileSync(path.join(LOCAL_TAVILY_CACHE_DIR, file), "utf-8"),
      ) as LocalTavilyCacheEntry;
      if (parsed.beatboxerName?.trim()) {
        names.add(parsed.beatboxerName.trim().toUpperCase());
      }
    } catch {
      continue;
    }
  }
  return names;
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
