/** 検索 API のステータス（Sheets 記録用）。 */
export type SearchStatus =
  | "ok"
  | "cached"
  | "denylist"
  | "no_match"
  | "credits_exhausted"
  | "error";

/** 検索リクエスト。 */
export type SearchRequest = {
  query: string;
  lang: string;
  year: number;
};

/** ページ選出の成功結果。 */
export type SelectOk = {
  kind: "ok";
  path: string;
  confidence: number;
};

/** ページが見つからない結果。 */
export type SelectNoMatch = {
  kind: "no_match";
  confidence: number;
};

export type SelectResult = SelectOk | SelectNoMatch;
