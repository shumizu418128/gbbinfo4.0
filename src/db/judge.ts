import { asc, eq } from "drizzle-orm";
import { normalizeParticipantName } from "~/util/participant.js";
import { loadBuildCache } from "./buildCache.js";
import { getDb } from "./client.js";
import type { JudgePanel, JudgeWithRelations } from "./judgeTypes.js";
import { judgeTable } from "./tables.js";

export type { JudgePanel, JudgeWithRelations } from "./judgeTypes.js";

const toPanel = (id: number, panel: string): JudgePanel => {
  if (panel === "main" || panel === "wildcard") {
    return panel;
  }
  throw new Error(`Judge panel invalid: id=${id}`);
};

/**
 * 指定年の審査員一覧を id 順で取得する。
 *
 * Args:
 *   year: 取得対象の開催年。
 *
 * Returns:
 *   Country・Category 付きの Judge 一覧。該当が無い年は空配列。
 *
 * Raises:
 *   Error: 関連 Country または Category が無い、または panel が不正な場合。
 */
export const findJudges = async (year: number): Promise<JudgeWithRelations[]> => {
  const store = loadBuildCache();
  if (store) {
    return store.judgesByYear.get(year) ?? [];
  }

  const rows = await getDb().query.judgeTable.findMany({
    where: eq(judgeTable.year, year),
    with: {
      country: true,
      categoryInfo: true,
    },
    orderBy: [asc(judgeTable.id)],
  });

  return rows.map((row) => {
    if (!row.country || !row.categoryInfo) {
      throw new Error(`Judge relations missing: id=${row.id}`);
    }
    return {
      ...row,
      name: normalizeParticipantName(row.name),
      panel: toPanel(row.id, row.panel),
    };
  });
};
