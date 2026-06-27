import { TAVILY_EXCLUDE_DOMAINS } from "../../../shared/tavily/constants.ts";

export type TavilyApiResponse = {
  answer?: string | null;
  results?: unknown[];
  [key: string]: unknown;
};

/**
 * Tavily API でビートボクサーを検索する。
 *
 * Args:
 *   beatboxerName: 出場者名。
 *   apiKey: Tavily API キー。
 *
 * Returns:
 *   Tavily API レスポンス JSON。
 */
export const fetchTavilySearch = async (
  beatboxerName: string,
  apiKey: string,
): Promise<TavilyApiResponse> => {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query: `${beatboxerName} beatbox`,
      max_results: 12,
      include_answer: "basic",
      include_favicon: true,
      exclude_domains: [...TAVILY_EXCLUDE_DOMAINS],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Tavily API error: ${response.status} ${await response.text()}`,
    );
  }

  return (await response.json()) as TavilyApiResponse;
};
