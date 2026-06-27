import type { SupportedLanguage } from "~/constants/languageLabels.js";
import {
  BAN_WORDS,
  FACEBOOK_ACCOUNT_PATTERN,
  INSTAGRAM_ACCOUNT_PATTERN,
  SOUNDCLOUD_ACCOUNT_PATTERN,
  SPOTIFY_ACCOUNT_PATTERN,
  TWITTER_ACCOUNT_PATTERN,
  YOUTUBE_CHANNEL_PATTERN,
} from "~/constants/beatboxerSearch.js";
import type { AnswerTranslation, TavilyRow } from "~/db/tavily.js";

export type TavilySearchResultItem = {
  title: string;
  url: string;
  content: string;
  favicon?: string;
  primary_domain?: string;
};

export type ProcessedBeatboxerSearch = {
  accountUrls: TavilySearchResultItem[];
  finalUrls: TavilySearchResultItem[];
  youtubeEmbedUrl: string;
  answer: string;
};

type TavilySearchResultsJson = {
  answer?: string | null;
  results?: TavilySearchResultItem[];
};

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
 * YouTube URL から video ID を抽出する。
 *
 * Args:
 *   url: YouTube 動画 URL。
 *
 * Returns:
 *   11 文字の video ID。見つからなければ null。
 */
const extractYoutubeVideoId = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube")) {
      const v = parsed.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
        return v;
      }
      const embedMatch = parsed.pathname.match(
        /^\/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})(?:\/.*)?$/,
      );
      if (embedMatch) {
        return embedMatch[1];
      }
    }
    if (parsed.hostname.includes("youtu.be")) {
      const shortMatch = parsed.pathname.match(/^\/([a-zA-Z0-9_-]{11})/);
      if (shortMatch) {
        return shortMatch[1];
      }
    }
  } catch {
    return null;
  }
  return null;
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
const containsBanWord = (item: TavilySearchResultItem): boolean => {
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
): Omit<ProcessedBeatboxerSearch, "answer"> => {
  const unfiltered = searchResults.results ?? [];
  const filtered = unfiltered.filter((item) => !containsBanWord(item));

  const accountUrls: TavilySearchResultItem[] = [];
  const finalUrls: TavilySearchResultItem[] = [];
  let youtubeEmbedUrl = "";
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

  return { accountUrls, finalUrls, youtubeEmbedUrl };
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
 *
 * Returns:
 *   加工済み検索結果。
 */
export const buildProcessedBeatboxerSearch = (
  row: TavilyRow | null,
  locale: SupportedLanguage,
): ProcessedBeatboxerSearch => {
  if (!row) {
    return {
      accountUrls: [],
      finalUrls: [],
      youtubeEmbedUrl: "",
      answer: "",
    };
  }

  const searchResults = row.searchResults as TavilySearchResultsJson;
  const answerTranslation = (row.answerTranslation ?? {}) as AnswerTranslation;
  const processed = processBeatboxerSearchResults(searchResults);

  return {
    ...processed,
    answer: resolveTavilyAnswer(searchResults, answerTranslation, locale),
  };
};
