// DBのCategoryテーブルの値を定義 毎回DBからとるのは非効率なので型で定義
export type Category =
  | "Loopstation"
  | "Producer"
  | "Tag Team Loopstation"
  | "Solo"
  | "Tag Team"
  | "Crew"
  | "U18"
  | "SHOWCASE (loopstation)"
  | "SHOWCASE (producer)"
  | "SHOWCASE (solo)";

export type TicketClass =
  | "all"
  | "Wildcard"
  | "challenger_series";

export type CancelFilter =
  | "all"
  | "active"
  | "cancelled";
