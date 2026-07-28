import type { AnswerTranslation } from "../../../shared/tavily/types.ts";
import {
  findTavilyByCacheKey,
  type TavilyRow,
} from "@shared/db/tavily.js";
import {
  isAnswerTranslationComplete,
  writeLocalTavilyCache,
} from "./local-cache-write.ts";

export type CachedTavilyStatus =
  | { kind: "missing" }
  | {
      kind: "answer_only" | "complete";
      row: TavilyRow;
      answer: string;
      answerTranslation: AnswerTranslation;
    };

/**
 * 既存 Tavily 行の同期状態を返す。
 *
 * Args:
 *   cacheKey: キャッシュキー。
 *
 * Returns:
 *   missing: 行なし / answer なし。
 *   answer_only: answer はあるが ja/ko 翻訳が不足。
 *   complete: answer と ja/ko 翻訳が揃っている。
 */
export const getCachedTavilyStatus = async (
  cacheKey: string,
): Promise<CachedTavilyStatus> => {
  const row = await findTavilyByCacheKey(cacheKey);
  if (!row) {
    return { kind: "missing" };
  }

  const searchResults = row.searchResults as { answer?: string | null };
  const answer = searchResults.answer;
  if (answer == null || answer === "") {
    return { kind: "missing" };
  }

  const answerTranslation = (row.answerTranslation ?? {}) as AnswerTranslation;
  return {
    kind: isAnswerTranslationComplete(answerTranslation)
      ? "complete"
      : "answer_only",
    row,
    answer,
    answerTranslation,
  };
};

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
  const status = await getCachedTavilyStatus(cacheKey);
  return status.kind !== "missing";
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
