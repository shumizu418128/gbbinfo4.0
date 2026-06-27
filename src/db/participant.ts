import { and, eq, ne, sql } from "drizzle-orm";
import { MULTI_NATIONAL_ISO_CODE } from "~/constants/country.js";
import {
  type ParticipantDetailPath,
  type ParticipantType,
} from "~/constants/participantType.js";
import {
  participantDetailPathFromMember,
  participantDetailPathFromParticipant,
} from "~/util/participant.js";
import { resolveParticipantCountries } from "~/util/country.js";
import { sortParticipants } from "~/util/participant.js";
import { getDb } from "./client.js";
import {
  participantMemberTable,
  participantTable,
} from "./tables.js";
import type { WithRequired } from "./utils.js";

/** 出場者未定を表す iso_code（詳細ページ対象外）。 */
const UNKNOWN_ISO_CODE = 0;

/** 過去年度ボタンから除外する開催年。 */
const EXCLUDED_PAST_YEARS = new Set([2013, 2014, 2015, 2016]);

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

/**
 * 指定年の Participant 一覧と関連データを取得する。
 *
 * Args:
 *   year: 取得対象の開催年。
 *   category: カテゴリ ID による絞り込み。null の場合は全カテゴリ。
 *   cancel: キャンセル状態による絞り込み。
 *     "cancelled" のときキャンセル済みのみ、"active" のとき未キャンセルのみ、
 *     "all" または null のときは状態で絞り込まない。
 *   isoCode: ISO 3166-1 数値コードによる絞り込み。null の場合は全国。
 *
 * Returns:
 *   Country・Category・メンバー情報を含む Participant 一覧。
 *
 * Raises:
 *   Error: 関連 Country または Category が存在しない行が含まれる場合。
 */
export const findParticipants = async (
  year: number,
  category: number | null,
  cancel: string | null,
  isoCode: number | null = null,
) => {
  const conditions = [eq(participantTable.year, year)];

  if (category !== null) {
    conditions.push(eq(participantTable.category, category));
  }

  if (cancel === "cancelled") {
    conditions.push(eq(participantTable.isCancelled, true));
  } else if (cancel === "active") {
    conditions.push(eq(participantTable.isCancelled, false));
  }

  if (isoCode !== null) {
    conditions.push(eq(participantTable.isoCode, isoCode));
  }

  let rows = await getDb().query.participantTable.findMany({
    where: and(...conditions),
    with: {
      country: true,
      categoryInfo: true,
      members: { with: { country: true } },
    },
  });

  rows = sortParticipants(rows);

  // 名前を大文字に変換
  rows.forEach(row => {
    if (row.name && typeof row.name === "string") {
      row.name = row.name.toUpperCase();
    }
  });

  return rows.map((row) => {
    if (!row.country || !row.categoryInfo) {
      throw new Error(`Participant relations missing: id=${row.id}`);
    }

    if (row.isoCode === MULTI_NATIONAL_ISO_CODE) {
      const countries = resolveParticipantCountries({
        country: row.country,
        isoCode: row.isoCode,
        members: row.members,
      });
      if (countries.length < 2) {
        throw new Error(
          `Multi-national participant requires at least 2 countries: id=${row.id}`,
        );
      }
    }

    return row as WithRequired<typeof row, "country" | "categoryInfo">;
  });
};

export type ParticipantWithRelations = Awaited<
  ReturnType<typeof findParticipants>
>[number];

const participantWithRelationsQuery = {
  country: true,
  categoryInfo: true,
  members: { with: { country: true } },
} as const;

const memberWithRelationsQuery = {
  country: true,
  participantInfo: {
    with: {
      country: true,
      categoryInfo: true,
      members: { with: { country: true } },
    },
  },
} as const;

export type ParticipantDetailParticipant = ParticipantWithRelations;

export type ParticipantDetailMember = {
  id: number;
  participant: number;
  name: string;
  isoCode: number;
  country: ParticipantWithRelations["country"];
  participantInfo: ParticipantWithRelations;
};

export type PastParticipationEntry = ParticipantDetailPath & {
  year: number;
  name: string;
  category: string;
  categoryId: number;
  isCancelled: boolean;
};

export type { ParticipantDetailPath };

/**
 * 静的生成対象の出場者詳細パス一覧を返す。
 *
 * iso_code が 0（未定）の Participant は除外する。
 *
 * Returns:
 *   type と id の組み合わせ一覧。
 */
export const findAllParticipantDetailPaths =
  async (): Promise<ParticipantDetailPath[]> => {
    const [participants, members] = await Promise.all([
      getDb().query.participantTable.findMany({
        where: ne(participantTable.isoCode, UNKNOWN_ISO_CODE),
        with: { categoryInfo: true },
      }),
      getDb().query.participantMemberTable.findMany({
        columns: { id: true },
      }),
    ]);

    const paths: ParticipantDetailPath[] = [];

    for (const participant of participants) {
      if (!participant.categoryInfo) {
        throw new Error(`Participant category missing: id=${participant.id}`);
      }
      paths.push(participantDetailPathFromParticipant(participant));
    }

    for (const member of members) {
      paths.push(participantDetailPathFromMember(member.id));
    }

    return paths;
  };

/**
 * 出場者詳細用の Participant / ParticipantMember を取得する。
 *
 * Args:
 *   id: Participant または ParticipantMember の ID。
 *   type: single / team / member。
 *
 * Returns:
 *   type に応じた詳細データ。
 *
 * Raises:
 *   Error: データが存在しない、または type と部門種別が一致しない場合。
 */
export const findParticipantDetail = async (
  id: number,
  type: ParticipantType,
): Promise<
  | { type: "single" | "team"; data: ParticipantDetailParticipant }
  | { type: "member"; data: ParticipantDetailMember }
> => {
  if (type === "member") {
    const row = await getDb().query.participantMemberTable.findFirst({
      where: eq(participantMemberTable.id, id),
      with: memberWithRelationsQuery,
    });

    if (!row?.country || !row.participantInfo?.country || !row.participantInfo.categoryInfo) {
      throw new Error(`ParticipantMember not found or relations missing: id=${id}`);
    }

    row.name = normalizeParticipantName(row.name);
    row.participantInfo.name = normalizeParticipantName(row.participantInfo.name);
    for (const member of row.participantInfo.members) {
      member.name = normalizeParticipantName(member.name);
    }

    return {
      type: "member",
      data: row as ParticipantDetailMember,
    };
  }

  const row = await getDb().query.participantTable.findFirst({
    where: eq(participantTable.id, id),
    with: participantWithRelationsQuery,
  });

  if (!row?.country || !row.categoryInfo) {
    throw new Error(`Participant not found or relations missing: id=${id}`);
  }

  if (row.isoCode === UNKNOWN_ISO_CODE) {
    throw new Error(`Participant iso_code is unknown: id=${id}`);
  }

  const expectedPath = participantDetailPathFromParticipant(row);
  if (expectedPath.type !== type) {
    throw new Error(
      `Participant type mismatch: id=${id}, expected=${expectedPath.type}, got=${type}`,
    );
  }

  row.name = normalizeParticipantName(row.name);
  for (const member of row.members) {
    member.name = normalizeParticipantName(member.name);
  }

  if (row.isoCode === MULTI_NATIONAL_ISO_CODE) {
    const countries = resolveParticipantCountries({
      country: row.country,
      isoCode: row.isoCode,
      members: row.members,
    });
    if (countries.length < 2) {
      throw new Error(
        `Multi-national participant requires at least 2 countries: id=${row.id}`,
      );
    }
  }

  return {
    type,
    data: row as ParticipantDetailParticipant,
  };
};

/**
 * 同名の過去出場履歴を取得する（大文字小文字を区別しない完全一致）。
 *
 * Args:
 *   name: 検索対象の出場者名（表示用に正規化済みを想定）。
 *
 * Returns:
 *   年・部門順にソートされた過去出場一覧。
 */
export const findPastParticipation = async (
  name: string,
): Promise<PastParticipationEntry[]> => {
  const normalizedName = normalizeParticipantName(name);

  const [participantRows, memberRows] = await Promise.all([
    getDb().query.participantTable.findMany({
      where: sql`upper(${participantTable.name}) = upper(${normalizedName})`,
      with: {
        categoryInfo: true,
      },
    }),
    getDb().query.participantMemberTable.findMany({
      where: sql`upper(${participantMemberTable.name}) = upper(${normalizedName})`,
      with: {
        participantInfo: {
          with: { categoryInfo: true },
        },
      },
    }),
  ]);

  const pastData: PastParticipationEntry[] = [];

  for (const row of participantRows) {
    if (
      normalizeParticipantName(row.name) !== normalizedName ||
      !row.categoryInfo
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

  for (const row of memberRows) {
    if (
      normalizeParticipantName(row.name) !== normalizedName ||
      !row.participantInfo?.categoryInfo
    ) {
      continue;
    }
    pastData.push({
      ...participantDetailPathFromMember(row.id),
      year: row.participantInfo.year,
      name: normalizeParticipantName(row.name),
      category: row.participantInfo.categoryInfo.name,
      categoryId: row.participantInfo.category,
      isCancelled: row.participantInfo.isCancelled,
    });
  }

  pastData.sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }
    return a.categoryId - b.categoryId;
  });

  return pastData;
};

/**
 * 過去出場履歴から、詳細ページ下部ボタン用の開催年一覧を算出する。
 *
 * Args:
 *   pastData: 過去出場履歴。
 *   currentYear: 現在表示中の出場年。
 *
 * Returns:
 *   新しい順・最大4件の開催年。
 */
export const computePastYearParticipation = (
  pastData: PastParticipationEntry[],
  currentYear: number,
): number[] => {
  const years = new Set<number>();
  for (const entry of pastData) {
    if (!EXCLUDED_PAST_YEARS.has(entry.year)) {
      years.add(entry.year);
    }
  }

  if (years.size > 4) {
    years.delete(currentYear);
  }

  const sorted = [...years].sort((a, b) => b - a);
  return sorted.slice(0, 4);
};

/**
 * 同年・同部門の他出場者を最大5件返す（決定的選択）。
 *
 * Args:
 *   year: 開催年。
 *   categoryId: カテゴリ ID。
 *   excludeId: 除外する Participant ID。
 *
 * Returns:
 *   ソート済みの他出場者一覧（最大5件）。
 */
export const findSameYearCategoryPeers = async (
  year: number,
  categoryId: number,
  excludeId: number,
): Promise<ParticipantWithRelations[]> => {
  const rows = await findParticipants(year, categoryId, null);
  return rows.filter((row) => row.id !== excludeId).slice(0, 5);
};

/**
 * Tavily 同期用に、Participant / ParticipantMember から一意の出場者名を収集する。
 *
 * Returns:
 *   大文字正規化済みの一意な名前一覧。
 */
export const findUniqueBeatboxerNames = async (): Promise<string[]> => {
  const [participants, members] = await Promise.all([
    getDb().query.participantTable.findMany({
      columns: { name: true },
    }),
    getDb().query.participantMemberTable.findMany({
      columns: { name: true },
    }),
  ]);

  const names = new Set<string>();
  for (const row of [...participants, ...members]) {
    if (row.name?.trim()) {
      names.add(normalizeParticipantName(row.name.trim()));
    }
  }
  return [...names].sort();
};
