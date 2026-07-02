import {
  FACEBOOK_ACCOUNT_PATTERN,
  INSTAGRAM_ACCOUNT_PATTERN,
  SOUNDCLOUD_ACCOUNT_PATTERN,
  SPOTIFY_ACCOUNT_PATTERN,
  TWITTER_ACCOUNT_PATTERN,
  YOUTUBE_CHANNEL_PATTERN,
} from "../avatar/platforms.js";
import { extractYoutubeVideoId } from "../avatar/youtube.js";
import { BAN_WORDS } from "./constants.js";
import type {
  ProcessedBeatboxerSearchBase,
  TavilySearchResultItem,
  TavilySearchResultsJson,
} from "./types.js";

/**
 * URL からプライマリドメインを抽出する。
 *
 * Args:
 *   url: 対象 URL。
 *
 * Returns:
 *   例: example.com
 */
const getPrimaryDomain = (url: string): string => {
  try {
    const fullDomain = new URL(url).hostname.toLowerCase();
    const parts = fullDomain.split(".");
    if (parts.length >= 2) {
      return parts.slice(-2).join(".");
    }
    return fullDomain;
  } catch {
    return "";
  }
};

/**
 * 禁止ワードを含むか判定する。
 *
 * Args:
 *   item: Tavily 検索結果1件。
 *
 * Returns:
 *   禁止ワードを含めば true。
 */
export const containsBanWord = (item: TavilySearchResultItem): boolean => {
  const titleUpper = item.title.toUpperCase();
  const urlUpper = item.url.toUpperCase();
  const contentUpper = item.content.toUpperCase();
  return BAN_WORDS.some(
    (banWord) =>
      titleUpper.includes(banWord) ||
      urlUpper.includes(banWord) ||
      contentUpper.includes(banWord),
  );
};

/**
 * SNS アカウント URL かどうか判定する。
 *
 * Args:
 *   item: Tavily 検索結果1件。
 *
 * Returns:
 *   アカウント URL なら true。
 */
const isAccountUrl = (item: TavilySearchResultItem): boolean =>
  item.url.includes("@") ||
  item.title.includes("@") ||
  FACEBOOK_ACCOUNT_PATTERN.test(item.url) ||
  INSTAGRAM_ACCOUNT_PATTERN.test(item.url) ||
  SOUNDCLOUD_ACCOUNT_PATTERN.test(item.url) ||
  SPOTIFY_ACCOUNT_PATTERN.test(item.url) ||
  TWITTER_ACCOUNT_PATTERN.test(item.url) ||
  YOUTUBE_CHANNEL_PATTERN.test(item.url);

/**
 * Tavily 生 JSON をフィルタし、表示用データに加工する（3.0 beatboxer_tavily_search 相当）。
 *
 * Args:
 *   searchResults: Tavily.search_results JSON。
 *
 * Returns:
 *   アカウント URL・一般 URL・YouTube 埋め込み URL。
 */
export const processBeatboxerSearchResults = (
  searchResults: TavilySearchResultsJson,
): ProcessedBeatboxerSearchBase => {
  const unfiltered = searchResults.results ?? [];
  const filtered = unfiltered.filter((item) => !containsBanWord(item));

  const accountUrls: TavilySearchResultItem[] = [];
  const finalUrls: TavilySearchResultItem[] = [];
  let youtubeEmbedUrl = "";
  let youtubeVideoId = "";
  let originalYoutubeUrl = "";

  const accountDomainsSeen = new Set<string>();
  const finalDomainsSeen = new Set<string>();

  for (const item of filtered) {
    const primaryDomain = getPrimaryDomain(item.url);
    const enriched: TavilySearchResultItem = { ...item, primary_domain: primaryDomain };

    if (
      (primaryDomain === "youtube.com" || primaryDomain === "youtu.be") &&
      item.url.includes("/post/")
    ) {
      continue;
    }

    if (
      (primaryDomain === "youtube.com" || primaryDomain === "youtu.be") &&
      !youtubeEmbedUrl
    ) {
      const videoId = extractYoutubeVideoId(item.url);
      if (videoId) {
        youtubeVideoId = videoId;
        youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?controls=0&hd=1&vq=hd720`;
        originalYoutubeUrl = item.url;
      }
    }

    const isNewAccountDomain = !accountDomainsSeen.has(primaryDomain);
    if (isAccountUrl(enriched) && isNewAccountDomain) {
      accountUrls.push(enriched);
      accountDomainsSeen.add(primaryDomain);
    }

    const isNewFinalDomain = !finalDomainsSeen.has(primaryDomain);
    const isNotAccount = !accountUrls.includes(enriched);
    const isNotYoutube = item.url !== originalYoutubeUrl;

    if (isNewFinalDomain && isNotAccount && isNotYoutube) {
      finalUrls.push(enriched);
      finalDomainsSeen.add(primaryDomain);
    }
  }

  if (finalUrls.length >= 3) {
    return {
      accountUrls,
      finalUrls: finalUrls.slice(0, 5),
      youtubeEmbedUrl,
      youtubeVideoId,
    };
  }

  for (const item of filtered) {
    const enriched: TavilySearchResultItem = {
      ...item,
      primary_domain: getPrimaryDomain(item.url),
    };
    const isNotIncluded =
      !finalUrls.some((u) => u.url === enriched.url) &&
      !accountUrls.some((u) => u.url === enriched.url);
    const isNotYoutube = item.url !== originalYoutubeUrl;

    if (isNotIncluded && isNotYoutube) {
      finalUrls.push(enriched);
      if (finalUrls.length >= 3) {
        break;
      }
    }
  }

  return { accountUrls, finalUrls, youtubeEmbedUrl, youtubeVideoId };
};
