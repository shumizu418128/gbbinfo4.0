import { and, eq } from "drizzle-orm";
import { sortParticipants } from "~/util/participant.js";
import { getDb } from "./client.js";
import { categoryTable, participantTable } from "./tables.js";
import type { WithRequired } from "./utils.js";

/**
 * 指定年の Participant 一覧と関連データを取得する。
 *
 * Args:
 *   year: 取得対象の開催年。
 *   category: カテゴリ名による絞り込み。null の場合は全カテゴリ。
 *   ticketClass: 出場権種別による絞り込み。"all" または null の場合は全種別。
 *   cancel: キャンセル状態による絞り込み。
 *     "cancelled" のときキャンセル済みのみ、"active" のとき未キャンセルのみ、
 *     "all" または null のときは状態で絞り込まない。
 *
 * Returns:
 *   Country・Category・メンバー情報を含む Participant 一覧。
 *
 * Raises:
 *   Error: 関連 Country または Category が存在しない行が含まれる場合。
 */
export const findParticipants = async (
  year: number,
  category: string | null,
  ticketClass: string | null,
  cancel: string | null,
) => {
  const conditions = [eq(participantTable.year, year)];

  if (category) {
    const categoryRow = await getDb().query.categoryTable.findFirst({
      where: eq(categoryTable.name, category),
    });
    if (!categoryRow) {
      return [];
    }
    conditions.push(eq(participantTable.category, categoryRow.id));
  }

  if (ticketClass && ticketClass !== "all") {
    conditions.push(eq(participantTable.ticketClass, ticketClass));
  }

  if (cancel === "cancelled") {
    conditions.push(eq(participantTable.isCancelled, true));
  } else if (cancel === "active") {
    conditions.push(eq(participantTable.isCancelled, false));
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
    return row as WithRequired<typeof row, "country" | "categoryInfo">;
  });
};

export type ParticipantWithRelations = Awaited<
  ReturnType<typeof findParticipants>
>[number];
