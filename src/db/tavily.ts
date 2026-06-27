import { eq } from "drizzle-orm";
import { readLocalTavilyCache } from "@shared/tavily/local-cache-read.js";
import type { AnswerTranslation } from "@shared/tavily/types.js";
import { getDb } from "./client.js";
import { tavilyTable } from "./tables.js";

export type TavilyRow = typeof tavilyTable.$inferSelect;

export type { AnswerTranslation };

/**
 * cache_key で Tavily 行を1件取得する。
 *
 * Args:
 *   cacheKey: Tavily.cache_key。
 *
 * Returns:
 *   該当行。存在しない場合は null。
 */
export const findTavilyByCacheKey = async (
  cacheKey: string,
): Promise<TavilyRow | null> => {
  const row = await getDb().query.tavilyTable.findFirst({
    where: eq(tavilyTable.cacheKey, cacheKey),
  });
  return row ?? null;
};

/**
 * ページ表示用に Tavily データを取得する。
 *
 * 開発時は `.cache/tavily` のローカルキャッシュのみ参照し、DB にはアクセスしない。
 * 本番ビルド時は Supabase Tavily テーブルを参照する。
 *
 * Args:
 *   cacheKey: Tavily.cache_key。
 *
 * Returns:
 *   Tavily 行相当データ。存在しない場合は null。
 */
export const findTavilyDataForPage = async (
  cacheKey: string,
): Promise<TavilyRow | null> => {
  const isDev =
    typeof import.meta !== "undefined" && import.meta.env?.DEV === true;

  if (isDev) {
    const local = readLocalTavilyCache(cacheKey);
    if (!local) {
      return null;
    }
    return {
      id: 0,
      cacheKey: local.cacheKey,
      searchResults: local.searchResults,
      answerTranslation: local.answerTranslation,
      createdAt: new Date(local.updatedAt),
    };
  }

  return findTavilyByCacheKey(cacheKey);
};
