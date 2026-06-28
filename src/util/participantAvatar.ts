import { findTavilyFromStore, loadBuildCache } from "~/db/buildCache.js";
import type { TavilyRow } from "~/db/tavily.js";
import { findTavilyDataForPage } from "~/db/tavily.js";
import {
  processBeatboxerSearchResults,
  type TavilySearchResultItem,
} from "~/util/beatboxerSearchResults.js";
import { toTavilyCacheKey } from "~/util/tavily.js";

/**
 * Tavily 行から YouTube video ID を解決する。
 *
 * Args:
 *   row: Tavily テーブル行。null の場合は null。
 *
 * Returns:
 *   video ID。見つからなければ null。
 */
export const resolveYoutubeVideoIdFromTavilyRow = (
  row: TavilyRow | null,
): string | null => {
  if (!row) {
    return null;
  }
  const searchResults = row.searchResults as {
    answer?: string | null;
    results?: TavilySearchResultItem[];
  };
  const { youtubeVideoId } = processBeatboxerSearchResults(searchResults);
  return youtubeVideoId || null;
};

/**
 * ビルドキャッシュから同期的に YouTube video ID を解決する。
 *
 * Args:
 *   name: 出場者名。
 *
 * Returns:
 *   video ID。見つからなければ null。
 */
export const resolveYoutubeVideoIdSync = (name: string): string | null => {
  const store = loadBuildCache();
  if (!store) {
    return null;
  }
  const row = findTavilyFromStore(store, toTavilyCacheKey(name));
  return resolveYoutubeVideoIdFromTavilyRow(row);
};

/**
 * 出場者名から YouTube video ID を解決する。
 *
 * 優先順: ビルドキャッシュ → findTavilyDataForPage（dev 用）。
 *
 * Args:
 *   name: 出場者名。
 *
 * Returns:
 *   video ID。見つからなければ null。
 */
export const resolveYoutubeVideoId = async (
  name: string,
): Promise<string | null> => {
  const sync = resolveYoutubeVideoIdSync(name);
  if (sync) {
    return sync;
  }
  const row = await findTavilyDataForPage(toTavilyCacheKey(name));
  return resolveYoutubeVideoIdFromTavilyRow(row);
};

/**
 * 出場者名の配列からアバター用 video ID マップを構築する。
 *
 * Args:
 *   names: 出場者名の配列。
 *
 * Returns:
 *   名前をキー、video ID を値とするマップ。
 */
export const buildAvatarVideoIdMap = async (
  names: string[],
): Promise<Record<string, string>> => {
  const uniqueNames = [...new Set(names)];
  const entries = await Promise.all(
    uniqueNames.map(async (name) => {
      const videoId = await resolveYoutubeVideoId(name);
      return videoId ? ([name, videoId] as const) : null;
    }),
  );
  return Object.fromEntries(entries.filter((entry) => entry !== null));
};
