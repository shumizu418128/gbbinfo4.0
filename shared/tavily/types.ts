export type AnswerTranslation = Record<string, string>;

export type LocalTavilyCacheEntry = {
  cacheKey: string;
  beatboxerName: string;
  searchResults: Record<string, unknown>;
  answerTranslation: AnswerTranslation;
  updatedAt: string;
};

export type TavilySearchResultItem = {
  title: string;
  url: string;
  content: string;
  favicon?: string;
  primary_domain?: string;
};

export type TavilySearchResultsJson = {
  answer?: string | null;
  results?: TavilySearchResultItem[];
};

export type ProcessedBeatboxerSearchBase = {
  accountUrls: TavilySearchResultItem[];
  finalUrls: TavilySearchResultItem[];
  youtubeEmbedUrl: string;
  youtubeVideoId: string;
};
