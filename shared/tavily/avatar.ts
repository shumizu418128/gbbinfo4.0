import { normalizeUrlForSnsMatch } from "../avatar/normalize.js";
import {
  matchSnsAvatarPlatform,
  toAvatarSourceFromSnsMatch,
} from "../avatar/match.js";
import type { AvatarSource } from "../avatar/types.js";
import { buildAvatarProxyUrl, buildDetailAvatarImageUrl } from "../avatar/url.js";
import { extractYoutubeVideoId } from "../avatar/youtube.js";
import { containsBanWord } from "./process.js";
import type { TavilySearchResultsJson } from "./types.js";

/**
 * URL がアバター取得対象の SNS アカウント URL にマッチするか判定する。
 *
 * Args:
 *   url: 対象 URL。
 *
 * Returns:
 *   マッチ時は platform・正規化済み accountUrl・method。不一致時は null。
 */
export const matchSnsAccountUrl = (url: string) =>
  matchSnsAvatarPlatform(normalizeUrlForSnsMatch(url));

/**
 * Tavily 検索結果からアバター取得元を選定する。
 *
 * 優先順: YouTube / Spotify / SoundCloud / X → YouTube 動画サムネイル。
 * Instagram のみ対象外。
 *
 * Args:
 *   searchResults: Tavily.search_results JSON。
 *
 * Returns:
 *   取得元。見つからなければ null。
 */
export const resolveAvatarSourceFromSearchResults = (
  searchResults: TavilySearchResultsJson,
): AvatarSource | null => {
  const items = (searchResults.results ?? []).filter(
    (item) => !containsBanWord(item),
  );

  for (const item of items) {
    const sns = matchSnsAccountUrl(item.url);
    if (sns) {
      return toAvatarSourceFromSnsMatch(sns);
    }
  }

  for (const item of items) {
    const videoId = extractYoutubeVideoId(item.url);
    if (videoId) {
      return {
        kind: "youtubeThumbnail",
        videoId,
        sourceUrl: item.url,
      };
    }
  }

  return null;
};

/**
 * Tavily 検索結果から Cloudflare avatar proxy URL を組み立てる。
 *
 * Args:
 *   assetBaseUrl: PUBLIC_ASSET_BASE_URL。
 *   name: 出場者名。
 *   searchResults: Tavily.search_results JSON。
 *
 * Returns:
 *   proxy URL。取得元が無ければ null。
 */
export const buildAvatarProxyUrlFromSearchResults = (
  assetBaseUrl: string,
  name: string,
  searchResults: TavilySearchResultsJson,
): string | null => {
  const source = resolveAvatarSourceFromSearchResults(searchResults);
  if (!source) {
    return null;
  }

  return buildAvatarProxyUrl(assetBaseUrl, name, source);
};

/**
 * Tavily 検索結果から出場者詳細用のアバター画像 URL を組み立てる。
 *
 * Args:
 *   assetBaseUrl: PUBLIC_ASSET_BASE_URL。
 *   name: 出場者名。
 *   searchResults: Tavily.search_results JSON。
 *
 * Returns:
 *   画像 URL。取得元が無ければ null。
 */
export const buildDetailAvatarImageUrlFromSearchResults = (
  assetBaseUrl: string,
  name: string,
  searchResults: TavilySearchResultsJson,
): string | null => {
  const source = resolveAvatarSourceFromSearchResults(searchResults);
  if (!source) {
    return null;
  }

  return buildDetailAvatarImageUrl(assetBaseUrl, name, source);
};
