export type LanguageCode =
  | "ja"
  | "ko"
  | "en"
  | "cs"
  | "da"
  | "de"
  | "es"
  | "et"
  | "fr"
  | "hi"
  | "hu"
  | "it"
  | "ms"
  | "nl"
  | "no"
  | "pl"
  | "pt"
  | "ta"
  | "zh_Hans_CN"
  | "zh_Hant_TW";

export type EventContentSlug =
  | "top"
  | "ticket"
  | "timetable"
  | "stream"
  | "rule"
  | "wildcards";

export type PublicContentBucket = "others" | "travel";

export interface Participant {
  id: number;
  name: string;
  country: string;
  crew: string;
  category: string;
}

export interface TournamentResult {
  category: string;
  champion: string;
  runnerUp: string;
  year: number;
}

export interface WorldMapPoint {
  id: number;
  lat: number;
  lng: number;
  title: string;
  url?: string;
}
