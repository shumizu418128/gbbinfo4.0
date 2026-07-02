import { findTavilyFromStore, loadBuildCache } from "~/db/buildCache.js";
import type { TavilyRow } from "~/db/tavily.js";
import { findTavilyDataForPage } from "~/db/tavily.js";
import {
  buildAvatarProxyUrlFromSearchResults,
  type TavilySearchResultItem,
} from "~/util/beatboxerSearchResults.js";
import { toTavilyCacheKey } from "~/util/tavily.js";

type TavilySearchResultsJson = {
  answer?: string | null;
  results?: TavilySearchResultItem[];
};

/**
 * Tavily 行からアバター proxy URL を解決する。
 *
 * Args:
 *   name: 出場者名。
 *   row: Tavily テーブル行。null の場合は null。
 *
 * Returns:
 *   proxy URL。見つからなければ null。
 */
export const resolveAvatarProxyUrlFromTavilyRow = (
  name: string,
  row: TavilyRow | null,
): string | null => {
  if (!row) {
    return null;
  }
  const searchResults = row.searchResults as TavilySearchResultsJson;
  return buildAvatarProxyUrlFromSearchResults(name, searchResults);
};

/**
 * 出場者名からアバター proxy URL を解決する。
 *
 * 優先順: ビルドキャッシュ → findTavilyDataForPage（dev 用）。
 *
 * Args:
 *   name: 出場者名。
 *
 * Returns:
 *   proxy URL。見つからなければ null。
 */
export const resolveAvatarProxyUrl = async (
  name: string,
): Promise<string | null> => {
  const store = loadBuildCache();
  if (store) {
    const row = findTavilyFromStore(store, toTavilyCacheKey(name));
    const cached = resolveAvatarProxyUrlFromTavilyRow(name, row);
    if (cached) {
      return cached;
    }
  }
  const row = await findTavilyDataForPage(toTavilyCacheKey(name));
  return resolveAvatarProxyUrlFromTavilyRow(name, row);
};

/**
 * 出場者名の配列からアバター用 proxy URL マップを構築する。
 *
 * Args:
 *   names: 出場者名の配列。
 *
 * Returns:
 *   名前をキー、proxy URL を値とするマップ。
 */
export const buildAvatarImageUrlMap = async (
  names: string[],
): Promise<Record<string, string>> => {
  const uniqueNames = [...new Set(names)];
  const entries = await Promise.all(
    uniqueNames.map(async (name) => {
      const imageUrl = await resolveAvatarProxyUrl(name);
      return imageUrl ? ([name, imageUrl] as const) : null;
    }),
  );
  return Object.fromEntries(entries.filter((entry) => entry !== null));
};
