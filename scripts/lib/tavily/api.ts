import { tavily, type TavilySearchResponse } from "@tavily/core";
import { TAVILY_EXCLUDE_DOMAINS } from "../../../shared/tavily/constants.ts";

export type TavilyApiResponse = TavilySearchResponse;

/**
 * Tavily API でビートボクサーを検索する。
 *
 * Args:
 *   beatboxerName: 出場者名。
 *   apiKey: Tavily API キー。
 *
 * Returns:
 *   Tavily API レスポンス。
 */
export const fetchTavilySearch = async (
  beatboxerName: string,
  apiKey: string,
): Promise<TavilyApiResponse> => {
  const client = tavily({ apiKey });
  return client.search(`${beatboxerName} beatbox`, {
    maxResults: 12,
    includeAnswer: "basic",
    includeFavicon: true,
    excludeDomains: [...TAVILY_EXCLUDE_DOMAINS],
  });
};
