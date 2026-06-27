import { eq } from "drizzle-orm";
import { readLocalTavilyCache } from "~/util/tavily.js";
import { getDb } from "./client.js";
import { tavilyTable } from "./tables.js";

export type TavilyRow = typeof tavilyTable.$inferSelect;

export type AnswerTranslation = Record<string, string>;

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

/**
 * 既存行の answer_translation のみ更新する。
 *
 * Args:
 *   cacheKey: キャッシュキー。
 *   answerTranslation: 翻訳 JSON。
 */
export const updateTavilyAnswerTranslation = async (
  cacheKey: string,
  answerTranslation: AnswerTranslation,
): Promise<void> => {
  await getDb()
    .update(tavilyTable)
    .set({ answerTranslation })
    .where(eq(tavilyTable.cacheKey, cacheKey));
};
