import { and, eq } from "drizzle-orm";
import { MULTI_NATIONAL_ISO_CODE } from "~/constants/country.js";
import { resolveParticipantCountries } from "~/util/country.js";
import { sortParticipants } from "~/util/participant.js";
import { getDb } from "./client.js";
import { participantTable } from "./tables.js";
import type { WithRequired } from "./utils.js";

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
