import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import orderBy from "lodash/orderBy.js";
import {
  BUILD_CACHE_VERSION,
  BUILD_SNAPSHOT_FILE,
  LOCAL_BUILD_CACHE_DIR,
} from "@shared/build-cache/constants.js";
import type {
  BuildCacheSnapshot,
  SnapshotParticipant,
  SnapshotParticipantMemberDetail,
  SnapshotTavilyRow,
  SnapshotYearWithCountry,
} from "@shared/build-cache/types.js";
import { MULTI_NATIONAL_ISO_CODE } from "~/constants/country.js";
import type { ParticipantDetailPath, ParticipantType } from "~/constants/participantType.js";
import type { TavilyRow } from "~/db/tavily.js";
import type { YearWithCountry } from "~/db/year.js";
import {
  isUnknownParticipantName,
  participantDetailPathFromMember,
  participantDetailPathFromParticipant,
} from "~/util/participant.js";
import { resolveParticipantCountries } from "~/util/country.js";
import { sortParticipants } from "~/util/participant.js";
import type {
  ParticipantDetailMember,
  ParticipantDetailParticipant,
  ParticipantWithRelations,
  PastParticipationEntry,
} from "./participantTypes.js";

/** 出場者未定を表す iso_code（詳細ページ対象外）。 */
const UNKNOWN_ISO_CODE = 0;

/**
 * 参加者名を表示用に大文字へ正規化する。
 *
 * Args:
 *   name: 元の名前。
 *
 * Returns:
 *   大文字化した名前。
 */
const normalizeParticipantName = (name: string): string => name.toUpperCase();

/** ビルドキャッシュのインデックス付きストア。 */
export type BuildCacheStore = {
  snapshot: BuildCacheSnapshot;
  allYears: number[];
  yearsByYear: Map<number, YearWithCountry>;
  participants: ParticipantWithRelations[];
  participantsById: Map<number, ParticipantWithRelations>;
  membersById: Map<number, ParticipantDetailMember>;
  participantsByNormalizedName: Map<string, SnapshotParticipant[]>;
  membersByNormalizedName: Map<string, SnapshotParticipantMemberDetail[]>;
  tavilyByCacheKey: Map<string, TavilyRow>;
};

let cachedStore: BuildCacheStore | null = null;

/**
 * SnapshotParticipant を ParticipantWithRelations に変換する。
 *
 * Args:
 *   row: スナップショット行。
 *
 * Returns:
 *   関連付き Participant。
 *
 * Raises:
 *   Error: 多国代表で country が 2 件未満の場合。
 */
const toParticipantWithRelations = (
  row: SnapshotParticipant,
): ParticipantWithRelations => {
  const participant = {
    ...row,
    name: normalizeParticipantName(row.name),
    members: row.members.map((member) => ({
      ...member,
      name: normalizeParticipantName(member.name),
    })),
  };

  if (participant.isoCode === MULTI_NATIONAL_ISO_CODE) {
    const countries = resolveParticipantCountries({
      country: participant.country,
      isoCode: participant.isoCode,
      members: participant.members,
    });
    if (countries.length < 2) {
      throw new Error(
        `Multi-national participant requires at least 2 countries: id=${participant.id}`,
      );
    }
  }

  return participant as ParticipantWithRelations;
};

/**
 * SnapshotYearWithCountry を YearWithCountry に変換する。
 *
 * Args:
 *   row: スナップショット行。
 *
 * Returns:
 *   Country 付き Year。
 */
const toYearWithCountry = (row: SnapshotYearWithCountry): YearWithCountry =>
  ({
    ...row,
    startsAt: row.startsAt ? new Date(row.startsAt) : null,
    endsAt: row.endsAt ? new Date(row.endsAt) : null,
  }) as YearWithCountry;

/**
 * SnapshotTavilyRow を TavilyRow に変換する。
 *
 * Args:
 *   row: スナップショット行。
 *
 * Returns:
 *   Tavily 行。
 */
const toTavilyRow = (row: SnapshotTavilyRow): TavilyRow =>
  ({
    ...row,
    createdAt: new Date(row.createdAt),
  }) as TavilyRow;

/**
 * スナップショット JSON から BuildCacheStore を構築する。
 *
 * Args:
 *   snapshot: パース済みスナップショット。
 *
 * Returns:
 *   インデックス付きストア。
 */
export const buildStoreFromSnapshot = (
  snapshot: BuildCacheSnapshot,
): BuildCacheStore => {
  if (snapshot.version !== BUILD_CACHE_VERSION) {
    throw new Error(
      `Build cache version mismatch: expected ${BUILD_CACHE_VERSION}, got ${snapshot.version}`,
    );
  }

  const participants = sortParticipants(
    snapshot.participants.map(toParticipantWithRelations),
  );

  const participantsById = new Map<number, ParticipantWithRelations>();
  for (const participant of participants) {
    participantsById.set(participant.id, participant);
  }

  const membersById = new Map<number, ParticipantDetailMember>();
  for (const row of snapshot.members) {
    const participantInfo = toParticipantWithRelations(row.participantInfo);
    const member: ParticipantDetailMember = {
      id: row.id,
      participant: row.participant,
      name: normalizeParticipantName(row.name),
      isoCode: row.isoCode,
      country: row.country,
      participantInfo,
    };
    membersById.set(row.id, member);
  }

  const participantsByNormalizedName = new Map<string, SnapshotParticipant[]>();
  for (const row of snapshot.participants) {
    const key = normalizeParticipantName(row.name);
    const list = participantsByNormalizedName.get(key) ?? [];
    list.push(row);
    participantsByNormalizedName.set(key, list);
  }

  const membersByNormalizedName = new Map<
    string,
    SnapshotParticipantMemberDetail[]
  >();
  for (const row of snapshot.members) {
    const key = normalizeParticipantName(row.name);
    const list = membersByNormalizedName.get(key) ?? [];
    list.push(row);
    membersByNormalizedName.set(key, list);
  }

  const yearsByYear = new Map<number, YearWithCountry>();
  for (const row of snapshot.years) {
    yearsByYear.set(row.year, toYearWithCountry(row));
  }

  const allYears = orderBy(snapshot.allYears, [], ["desc"]);

  const tavilyByCacheKey = new Map<string, TavilyRow>();
  for (const row of snapshot.tavily) {
    tavilyByCacheKey.set(row.cacheKey, toTavilyRow(row));
  }

  return {
    snapshot,
    allYears,
    yearsByYear,
    participants,
    participantsById,
    membersById,
    participantsByNormalizedName,
    membersByNormalizedName,
    tavilyByCacheKey,
  };
};

/**
 * `.cache/build/snapshot.json` を読み込み BuildCacheStore を返す。
 *
 * Returns:
 *   ストア。ファイルが無い場合は null。
 *
 * Raises:
 *   Error: バージョン不一致または JSON 不正。
 */
export const loadBuildCache = (): BuildCacheStore | null => {
  if (cachedStore) {
    return cachedStore;
  }

  const snapshotPath = path.join(LOCAL_BUILD_CACHE_DIR, BUILD_SNAPSHOT_FILE);
  if (!existsSync(snapshotPath)) {
    return null;
  }

  const snapshot = JSON.parse(
    readFileSync(snapshotPath, "utf-8"),
  ) as BuildCacheSnapshot;

  cachedStore = buildStoreFromSnapshot(snapshot);
  return cachedStore;
};

/**
 * ビルドキャッシュが利用可能か判定する。
 *
 * Returns:
 *   スナップショットが読み込める場合 true。
 */
export const hasBuildCache = (): boolean => loadBuildCache() !== null;

/**
 * スナップショットから Tavily 行を取得する。
 *
 * Args:
 *   store: ビルドキャッシュストア。
 *   cacheKey: Tavily.cache_key。
 *
 * Returns:
 *   Tavily 行。存在しない場合 null。
 */
export const findTavilyFromStore = (
  store: BuildCacheStore,
  cacheKey: string,
): TavilyRow | null => store.tavilyByCacheKey.get(cacheKey) ?? null;

/**
 * スナップショットから Year 共通データを取得する。
 *
 * Args:
 *   store: ビルドキャッシュストア。
 *   year: 対象の開催年。
 *
 * Returns:
 *   yearWithCountry・years・latestYearWithCountry。
 *
 * Raises:
 *   Error: 指定年が存在しない場合。
 */
export const getCommonYearDataFromStore = (
  store: BuildCacheStore,
  year: number,
) => {
  const yearWithCountry = store.yearsByYear.get(year);
  if (!yearWithCountry) {
    throw new Error(`Year not found: ${year}`);
  }

  const latestYear = new Date().getFullYear();
  const latestYearWithCountry =
    year === latestYear
      ? yearWithCountry
      : store.yearsByYear.get(latestYear);
  if (!latestYearWithCountry) {
    throw new Error(`Year not found: ${latestYear}`);
  }

  return {
    yearWithCountry,
    years: store.allYears,
    latestYearWithCountry,
  };
};

/**
 * スナップショットから非年度ページの Header / Footer 用データを取得する。
 *
 * Args:
 *   store: ビルドキャッシュストア。
 *
 * Returns:
 *   years・latestYearWithCountry。
 *
 * Raises:
 *   Error: 最新年が存在しない場合。
 */
export const getHeaderFooterDataFromStore = (store: BuildCacheStore) => {
  const latestYear = new Date().getFullYear();
  const latestYearWithCountry = store.yearsByYear.get(latestYear);
  if (!latestYearWithCountry) {
    throw new Error(`Year not found: ${latestYear}`);
  }

  return {
    years: store.allYears,
    latestYearWithCountry,
  };
};

/**
 * スナップショットから静的生成対象の出場者詳細パス一覧を返す。
 *
 * Args:
 *   store: ビルドキャッシュストア。
 *
 * Returns:
 *   type と id の組み合わせ一覧。
 */
export const findAllParticipantDetailPathsFromStore = (
  store: BuildCacheStore,
): ParticipantDetailPath[] => {
  const paths: ParticipantDetailPath[] = [];

  for (const participant of store.snapshot.participants) {
    if (participant.isoCode === UNKNOWN_ISO_CODE) {
      continue;
    }
    if (isUnknownParticipantName(participant.name)) {
      continue;
    }
    paths.push(participantDetailPathFromParticipant(participant));
  }

  for (const member of store.snapshot.members) {
    if (isUnknownParticipantName(member.name)) {
      continue;
    }
    paths.push(participantDetailPathFromMember(member.id));
  }

  return paths;
};

/**
 * スナップショットから出場者詳細を取得する。
 *
 * Args:
 *   store: ビルドキャッシュストア。
 *   id: Participant または ParticipantMember の ID。
 *   type: single / team / member。
 *
 * Returns:
 *   type に応じた詳細データ。
 *
 * Raises:
 *   Error: データが存在しない、または type が一致しない場合。
 */
export const findParticipantDetailFromStore = (
  store: BuildCacheStore,
  id: number,
  type: ParticipantType,
):
  | { type: "single" | "team"; data: ParticipantDetailParticipant }
  | { type: "member"; data: ParticipantDetailMember } => {
  if (type === "member") {
    const row = store.membersById.get(id);
    if (!row) {
      throw new Error(`ParticipantMember not found: id=${id}`);
    }
    if (isUnknownParticipantName(row.name)) {
      throw new Error(`ParticipantMember name is unknown: id=${id}`);
    }
    return { type: "member", data: row };
  }

  const row = store.participantsById.get(id);
  if (!row) {
    throw new Error(`Participant not found: id=${id}`);
  }

  if (row.isoCode === UNKNOWN_ISO_CODE) {
    throw new Error(`Participant iso_code is unknown: id=${id}`);
  }

  if (isUnknownParticipantName(row.name)) {
    throw new Error(`Participant name is unknown: id=${id}`);
  }

  const expectedPath = participantDetailPathFromParticipant(row);
  if (expectedPath.type !== type) {
    throw new Error(
      `Participant type mismatch: id=${id}, expected=${expectedPath.type}, got=${type}`,
    );
  }

  return { type, data: row };
};

/**
 * スナップショットから同名の過去出場履歴を取得する。
 *
 * Args:
 *   store: ビルドキャッシュストア。
 *   name: 検索対象の出場者名。
 *
 * Returns:
 *   年・部門順にソートされた過去出場一覧。
 */
export const findPastParticipationFromStore = (
  store: BuildCacheStore,
  name: string,
): PastParticipationEntry[] => {
  if (isUnknownParticipantName(name)) {
    return [];
  }

  const normalizedName = normalizeParticipantName(name);
  const pastData: PastParticipationEntry[] = [];

  for (const row of store.participantsByNormalizedName.get(normalizedName) ?? []) {
    if (
      normalizeParticipantName(row.name) !== normalizedName ||
      isUnknownParticipantName(row.name)
    ) {
      continue;
    }
    pastData.push({
      ...participantDetailPathFromParticipant(row),
      year: row.year,
      name: normalizeParticipantName(row.name),
      category: row.categoryInfo.name,
      categoryId: row.category,
      isCancelled: row.isCancelled,
    });
  }

  for (const row of store.membersByNormalizedName.get(normalizedName) ?? []) {
    if (
      normalizeParticipantName(row.name) !== normalizedName ||
      isUnknownParticipantName(row.name) ||
      isUnknownParticipantName(row.participantInfo.name)
    ) {
      continue;
    }
    pastData.push({
      ...participantDetailPathFromMember(row.id),
      year: row.participantInfo.year,
      name: normalizeParticipantName(row.participantInfo.name),
      category: row.participantInfo.categoryInfo.name,
      categoryId: row.participantInfo.category,
      isCancelled: row.participantInfo.isCancelled,
    });
  }

  return orderBy(pastData, ["year", "categoryId"], ["desc", "asc"]);
};

/**
 * スナップショットから同年・同部門の他出場者を返す。
 *
 * Args:
 *   store: ビルドキャッシュストア。
 *   year: 開催年。
 *   categoryId: カテゴリ ID。
 *   excludeId: 除外する Participant ID。
 *
 * Returns:
 *   ソート済みの他出場者一覧。
 */
export const findSameYearCategoryPeersFromStore = (
  store: BuildCacheStore,
  year: number,
  categoryId: number,
  excludeId: number,
): ParticipantWithRelations[] =>
  store.participants.filter(
    (row) =>
      row.year === year &&
      row.category === categoryId &&
      row.id !== excludeId,
  );

/**
 * スナップショットから指定年の Participant 一覧を返す。
 *
 * Args:
 *   store: ビルドキャッシュストア。
 *   year: 取得対象の開催年。
 *   category: カテゴリ ID。null の場合は全カテゴリ。
 *   cancel: キャンセル状態による絞り込み。
 *   isoCode: ISO 3166-1 数値コード。null の場合は全国。
 *
 * Returns:
 *   Country・Category・メンバー情報を含む Participant 一覧。
 */
export const findParticipantsFromStore = (
  store: BuildCacheStore,
  year: number,
  category: number | null,
  cancel: string | null,
  isoCode: number | null = null,
): ParticipantWithRelations[] => {
  let rows = store.participants.filter((row) => row.year === year);

  if (category !== null) {
    rows = rows.filter((row) => row.category === category);
  }

  if (cancel === "cancelled") {
    rows = rows.filter((row) => row.isCancelled);
  } else if (cancel === "active") {
    rows = rows.filter((row) => !row.isCancelled);
  }

  if (isoCode !== null) {
    rows = rows.filter((row) => row.isoCode === isoCode);
  }

  return rows;
};

/**
 * テスト用にキャッシュをリセットする。
 */
export const resetBuildCacheForTests = (): void => {
  cachedStore = null;
};
