/**
 * 出場者名から Tavily キャッシュキーを生成する（3.0 互換）。
 *
 * Args:
 *   beatboxerName: 出場者名。
 *
 * Returns:
 *   `tavily_search_{sanitized}` 形式のキー。
 */
export const toTavilyCacheKey = (beatboxerName: string): string =>
  `tavily_search_${beatboxerName.trim().replace(/[^a-zA-Z0-9_-]/g, "_")}`;
