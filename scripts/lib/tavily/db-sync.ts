import type { AnswerTranslation } from "../../../shared/tavily/types.ts";
import { findTavilyByCacheKey } from "../db/tavily.ts";
import { writeLocalTavilyCache } from "./local-cache-write.ts";

/**
 * 既存 Tavily 行に answer があるか判定する。
 *
 * Args:
 *   cacheKey: キャッシュキー。
 *
 * Returns:
 *   answer が非 null なら true。
 */
export const hasCachedAnswer = async (cacheKey: string): Promise<boolean> => {
  const row = await findTavilyByCacheKey(cacheKey);
  if (!row) {
    return false;
  }
  const searchResults = row.searchResults as { answer?: string | null };
  return searchResults.answer != null;
};

/**
 * DB 行からローカルキャッシュを生成する。
 *
 * Args:
 *   cacheKey: キャッシュキー。
 *   beatboxerName: 出場者名。
 */
export const hydrateLocalCacheFromDb = async (
  cacheKey: string,
  beatboxerName: string,
): Promise<void> => {
  const row = await findTavilyByCacheKey(cacheKey);
  if (!row) {
    return;
  }

  const searchResults = row.searchResults as Record<string, unknown>;
  const answer = (searchResults as { answer?: string | null }).answer;
  if (answer == null) {
    return;
  }

  writeLocalTavilyCache({
    cacheKey,
    beatboxerName,
    searchResults,
    answerTranslation: (row.answerTranslation ?? {}) as AnswerTranslation,
    updatedAt: new Date().toISOString(),
  });
};

/**
 * DB の既存翻訳を返す。
 *
 * Args:
 *   cacheKey: キャッシュキー。
 *
 * Returns:
 *   既存 answer_translation。未設定時は空オブジェクト。
 */
export const findExistingTranslationsFromDb = async (
  cacheKey: string,
): Promise<AnswerTranslation> => {
  const existingDb = await findTavilyByCacheKey(cacheKey);
  return (existingDb?.answerTranslation ?? {}) as AnswerTranslation;
};
