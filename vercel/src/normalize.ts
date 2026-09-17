/**
 * 検索クエリを比較用に正規化する。
 *
 * Args:
 *   value: 生クエリ。
 *
 * Returns:
 *   前後空白を除き、連続空白を 1 つにし、大文字化した文字列。
 */
export const normalizeQuery = (value: string): string =>
  value.trim().replace(/\s+/g, " ").toUpperCase();

/**
 * キャッシュキーを組み立てる。
 *
 * Args:
 *   lang: 表示言語。
 *   year: ページ上の年。
 *   query: 生クエリ。
 *
 * Returns:
 *   lang|year|normalizedQuery。
 */
export const cacheKey = (lang: string, year: number, query: string): string =>
  `${lang}|${year}|${normalizeQuery(query)}`;
