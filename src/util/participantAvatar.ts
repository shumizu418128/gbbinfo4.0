import { findTavilyFromStore, loadBuildCache } from "~/db/buildCache.js";
import type { TavilyRow } from "~/db/tavily.js";
import { findTavilyDataForPage } from "~/db/tavily.js";
import {
  resolveAvatarImageUrlFromSearchResults,
  type TavilySearchResultItem,
} from "~/util/beatboxerSearchResults.js";
import { toTavilyCacheKey } from "~/util/tavily.js";

type TavilySearchResultsJson = {
  answer?: string | null;
  results?: TavilySearchResultItem[];
};

/**
 * Tavily 行からアバター画像 URL を解決する。
 *
 * Args:
 *   row: Tavily テーブル行。null の場合は null。
 *
 * Returns:
 *   画像 URL。見つからなければ null。
 */
export const resolveAvatarImageUrlFromTavilyRow = async (
  row: TavilyRow | null,
): Promise<string | null> => {
  if (!row) {
    return null;
  }
  const searchResults = row.searchResults as TavilySearchResultsJson;
  return resolveAvatarImageUrlFromSearchResults(searchResults);
};

/**
 * 出場者名からアバター画像 URL を解決する。
 *
 * 優先順: ビルドキャッシュ → findTavilyDataForPage（dev 用）。
 *
 * Args:
 *   name: 出場者名。
 *
 * Returns:
 *   画像 URL。見つからなければ null。
 */
export const resolveAvatarImageUrl = async (
  name: string,
): Promise<string | null> => {
  const store = loadBuildCache();
  if (store) {
    const row = findTavilyFromStore(store, toTavilyCacheKey(name));
    const cached = await resolveAvatarImageUrlFromTavilyRow(row);
    if (cached) {
      return cached;
    }
  }
  const row = await findTavilyDataForPage(toTavilyCacheKey(name));
  return resolveAvatarImageUrlFromTavilyRow(row);
};

/**
 * 出場者名の配列からアバター用画像 URL マップを構築する。
 *
 * Args:
 *   names: 出場者名の配列。
 *
 * Returns:
 *   名前をキー、画像 URL を値とするマップ。
 */
export const buildAvatarImageUrlMap = async (
  names: string[],
): Promise<Record<string, string>> => {
  const uniqueNames = [...new Set(names)];
  const entries = await Promise.all(
    uniqueNames.map(async (name) => {
      const imageUrl = await resolveAvatarImageUrl(name);
      return imageUrl ? ([name, imageUrl] as const) : null;
    }),
  );
  return Object.fromEntries(entries.filter((entry) => entry !== null));
};
