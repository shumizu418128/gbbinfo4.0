import { eq } from "drizzle-orm";
import type { AnswerTranslation } from "../tavily/types.js";
import { getDb } from "./client.js";
import { tavilyTable } from "./tables.js";

export type TavilyRow = typeof tavilyTable.$inferSelect;

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
 * Tavily 行を upsert する（sync スクリプト用）。
 *
 * Args:
 *   cacheKey: キャッシュキー。
 *   searchResults: Tavily API レスポンス JSON。
 *   answerTranslation: 翻訳済み answer（省略可）。
 */
export const upsertTavilyRow = async (
  cacheKey: string,
  searchResults: Record<string, unknown>,
  answerTranslation: AnswerTranslation = {},
): Promise<void> => {
  const db = getDb();
  const existing = await findTavilyByCacheKey(cacheKey);

  if (existing) {
    await db
      .update(tavilyTable)
      .set({
        searchResults,
        answerTranslation,
      })
      .where(eq(tavilyTable.cacheKey, cacheKey));
    return;
  }

  await db.insert(tavilyTable).values({
    cacheKey,
    searchResults,
    answerTranslation,
  });
};
