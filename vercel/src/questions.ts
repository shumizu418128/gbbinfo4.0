import { choice, noul } from "@typesafe-ai/sdk";

/** 人名なら participants へ寄せる Noul 閾値。 */
export const PERSON_NOUL_THRESHOLD = 0.55;

/** ハブ Choice を採用する最低 confidence。 */
export const SECTION_CONFIDENCE_THRESHOLD = 0.28;

/** 年未指定の Choice キー。 */
export const YEAR_UNSPECIFIED = "unspecified";

/** 年に紐づくハブセクション。 */
export const YEAR_SECTIONS = [
  "top",
  "timetable",
  "rule",
  "ticket",
  "stream",
  "participants",
  "result",
  "cancel",
  "wildcards",
  "japan",
  "korea",
  "top_7tosmoke",
] as const;

export type YearSection = (typeof YEAR_SECTIONS)[number];

export type HubSection = YearSection | "no_match";

const YEAR_SECTION_CRITERIA: Record<YearSection, string> = {
  top: "The year hub / top page",
  timetable: "Timetable listing the on-site event categories and schedule",
  rule: "Rules and judges — mainly Wildcard qualifier rules for entering GBB, plus Wildcard and on-site judges",
  ticket: "Tickets and the event venue",
  stream: "Livestream, watch online, YouTube",
  participants:
    "Participant list: beatboxer names, teams, Wildcard qualifier results, and seeded-entry lists",
  result: "Final competition results. Does not include Wildcard qualifier results",
  cancel: "Withdrawn / cancelled participants",
  wildcards: "List of Wildcard qualifier videos",
  japan: "Japan national team",
  korea: "Korea national team",
  top_7tosmoke: "7 to Smoke afterparty",
};

/**
 * TypeSafe に渡す質問を組み立てる。西暦は instructions に埋め込む。
 *
 * Args:
 *   calendarYear: 実行時点の西暦。
 *   pageYear: ユーザーが今見ている GBB 年。
 *   availableYears: カタログ上の開催年。
 *
 * Returns:
 *   isPerson / section / year の質問マップ。
 */
export const buildSearchQuestions = (
  calendarYear: number,
  pageYear: number,
  availableYears: number[],
) => {
  const lastCalendarYear = calendarYear - 1;
  const yearPhrase = `The current calendar year is ${calendarYear}. "this year" / 「今年」 means ${calendarYear}. "last year" / 「去年」 / 「昨年」 means ${lastCalendarYear}.`;

  const yearCriteria: Record<string, string> = {
    [YEAR_UNSPECIFIED]: `No year mentioned. Code will use the page year ${pageYear}.`,
  };
  for (const year of availableYears) {
    yearCriteria[String(year)] = `GBB ${year}`;
  }

  return {
    isPerson: noul(
      "Is the user looking for a specific beatboxer, crew, or person by name rather than a site section?",
      {
        true: "A personal or team name",
        false: "A section, event type, or topic such as timetable or tickets",
      },
    ),
    section: choice<Record<HubSection, string>>(
      `Which site section should open? Person names go to participants. ${yearPhrase}`,
      {
        ...YEAR_SECTION_CRITERIA,
        no_match: "Nothing on this site matches, or the query is nonsense",
      },
    ),
    year: choice(
      `Which GBB year should open? ${yearPhrase} The user is currently viewing GBB ${pageYear}. If they do not mention a year, choose unspecified.`,
      yearCriteria,
    ),
  };
};
