/** 年ごとのハブページ slug（top, timetable, participants など）。 */
export type YearSections = Record<string, string[]>;

/** 検索用ページカタログ。出場者詳細は含めない。 */
export type PageCatalog = {
  years: number[];
  yearSections: YearSections;
};
