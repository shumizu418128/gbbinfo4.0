import type { SupportedLanguage } from "~/constants/languageLabels.js";
import type { AnswerTranslation, TavilyRow } from "~/db/tavily.js";
import { buildDetailAvatarImageUrlFromSearchResults } from "@shared/tavily/avatar.js";
import { processBeatboxerSearchResults } from "@shared/tavily/process.js";
import type {
  TavilySearchResultItem,
  TavilySearchResultsJson,
} from "@shared/tavily/types.js";
import { getAssetBaseUrl } from "~/util/staticAsset.js";

export type {
  AnswerTranslation,
  LocalTavilyCacheEntry,
  TavilySearchResultItem,
} from "@shared/tavily/types.js";
export { toTavilyCacheKey } from "@shared/tavily/cache-key.js";
export { readLocalTavilyCache } from "@shared/tavily/local-cache-read.js";
export { containsBanWord, processBeatboxerSearchResults } from "@shared/tavily/process.js";
export {
  buildAvatarProxyUrlFromSearchResults,
  buildDetailAvatarImageUrlFromSearchResults,
  resolveAvatarSourceFromSearchResults,
} from "@shared/tavily/avatar.js";
export { extractYoutubeVideoId } from "@shared/avatar/youtube.js";

export type ProcessedBeatboxerSearch = {
  accountUrls: TavilySearchResultItem[];
  finalUrls: TavilySearchResultItem[];
  youtubeEmbedUrl: string;
  youtubeVideoId: string;
  avatarImageUrl: string;
  answer: string;
};

/**
 * ロケールに応じた Tavily answer テキストを取得する。
 *
 * Args:
 *   searchResults: Tavily.search_results JSON。
 *   answerTranslation: Tavily.answer_translation JSON。
 *   locale: 表示言語。
 *
 * Returns:
 *   紹介文。未設定時は空文字。
 */
export const resolveTavilyAnswer = (
  searchResults: TavilySearchResultsJson,
  answerTranslation: AnswerTranslation,
  locale: SupportedLanguage,
): string => {
  if (locale === "ja" || locale === "ko") {
    const translated = answerTranslation[locale];
    if (translated) {
      return translated;
    }
  }
  return searchResults.answer ?? "";
};

/**
 * Tavily 行から詳細ページ表示用の加工済み検索結果を構築する。
 *
 * Args:
 *   row: Tavily テーブル行。null の場合は空結果。
 *   locale: 表示言語。
 *   name: 出場者名（avatar proxy 用）。
 *
 * Returns:
 *   加工済み検索結果。
 */
export const buildProcessedBeatboxerSearch = (
  row: TavilyRow | null,
  locale: SupportedLanguage,
  name: string,
): ProcessedBeatboxerSearch => {
  if (!row) {
    return {
      accountUrls: [],
      finalUrls: [],
      youtubeEmbedUrl: "",
      youtubeVideoId: "",
      avatarImageUrl: "",
      answer: "",
    };
  }

  const searchResults = row.searchResults as TavilySearchResultsJson;
  const answerTranslation = (row.answerTranslation ?? {}) as AnswerTranslation;
  const processed = processBeatboxerSearchResults(searchResults);
  const assetBaseUrl = getAssetBaseUrl();

  return {
    ...processed,
    avatarImageUrl:
      buildDetailAvatarImageUrlFromSearchResults(assetBaseUrl, name, searchResults) ??
      "",
    answer: resolveTavilyAnswer(searchResults, answerTranslation, locale),
  };
};
