import type { AnswerTranslation } from "../tavily/types.ts";
import type { CountryNames } from "../../src/constants/languageLabels.ts";
import { BUILD_CACHE_VERSION } from "./constants.ts";

/** JSON シリアライズ可能な Country 行。 */
export type SnapshotCountry = {
  isoCode: number;
  latitude: string;
  longitude: string;
  names: CountryNames;
  enName: string | null;
  jaName: string | null;
  isoAlpha2: string | null;
};

/** JSON シリアライズ可能な Category 行。 */
export type SnapshotCategory = {
  id: number;
  name: string;
  isTeam: boolean;
};

/** JSON シリアライズ可能な Year + Country（中止年は country が null）。 */
export type SnapshotYearWithCountry = {
  year: number;
  startsAt: string | null;
  endsAt: string | null;
  categories: number[] | null;
  city: string | null;
  isoCode: number | null;
  country: SnapshotCountry | null;
};

/** JSON シリアライズ可能な ParticipantMember（country 付き）。 */
export type SnapshotParticipantMember = {
  id: number;
  participant: number;
  name: string;
  isoCode: number;
  country: SnapshotCountry;
};

/** JSON シリアライズ可能な Participant（関連込み）。 */
export type SnapshotParticipant = {
  id: number;
  name: string;
  year: number;
  isoCode: number;
  isCancelled: boolean;
  category: number;
  ticketClass: string;
  country: SnapshotCountry;
  categoryInfo: SnapshotCategory;
  members: SnapshotParticipantMember[];
};

/** JSON シリアライズ可能な ParticipantMember 詳細（participantInfo 込み）。 */
export type SnapshotParticipantMemberDetail = {
  id: number;
  participant: number;
  name: string;
  isoCode: number;
  country: SnapshotCountry;
  participantInfo: SnapshotParticipant;
};

/** JSON シリアライズ可能な Tavily 行。 */
export type SnapshotTavilyRow = {
  id: number;
  cacheKey: string;
  searchResults: unknown;
  createdAt: string;
  answerTranslation: AnswerTranslation;
};

/** ビルドスナップショット本体。 */
export type BuildCacheSnapshot = {
  version: typeof BUILD_CACHE_VERSION;
  generatedAt: string;
  /** ヘッダー表示用 Year（country 未定の中止年を含む）。 */
  years: SnapshotYearWithCountry[];
  /** ナビゲーション用の全開催年。 */
  allYears: number[];
  participants: SnapshotParticipant[];
  members: SnapshotParticipantMemberDetail[];
  tavily: SnapshotTavilyRow[];
};

/** スナップショット manifest。 */
export type BuildCacheManifest = {
  version: typeof BUILD_CACHE_VERSION;
  generatedAt: string;
};
