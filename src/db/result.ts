import { and, asc, eq } from "drizzle-orm";
import { getDb } from "./client.js";
import { rankingResultTable, tournamentResultTable } from "./tables.js";
import { normalizeParticipantName } from "~/util/participant.js";

type ParticipantNameFields = {
  name: string;
  members?: Array<{ name: string }>;
};

/**
 * 出場者とそのメンバー名を大文字へ正規化する。
 *
 * Args:
 *   participant: 出場者（members 任意）。
 */
const normalizeResultParticipant = <T extends ParticipantNameFields>(
  participant: T | null | undefined,
): void => {
  if (!participant) {
    return;
  }
  participant.name = normalizeParticipantName(participant.name);
  participant.members?.forEach((member) => {
    member.name = normalizeParticipantName(member.name);
  });
};

/**
 * 指定年・カテゴリのトーナメント結果一覧を取得する。
 *
 * Args:
 *   year: 大会開催年。
 *   categoryId: カテゴリ ID。
 *
 * Returns:
 *   TournamentResult 一覧（winner/loser の Participant, Country, Member を含む）。
 *   出場者名は大文字に正規化済み。
 */
export const findTournamentResults = async (year: number, categoryId: number) => {
  const rows = await getDb().query.tournamentResultTable.findMany({
    where: and(
      eq(tournamentResultTable.year, year),
      eq(tournamentResultTable.category, categoryId),
    ),
    with: {
      winnerParticipant: {
        with: {
          country: true,
          categoryInfo: true,
          members: { with: { country: true } },
        },
      },
      loserParticipant: {
        with: {
          country: true,
          categoryInfo: true,
          members: { with: { country: true } },
        },
      },
    },
  });

  for (const row of rows) {
    normalizeResultParticipant(row.winnerParticipant);
    normalizeResultParticipant(row.loserParticipant);
  }

  return rows;
};

export type TournamentResultWithRelations = Awaited<
  ReturnType<typeof findTournamentResults>
>[number];

/**
 * 指定年・カテゴリのランキング結果一覧を rank 昇順で取得する。
 *
 * Args:
 *   year: 大会開催年。
 *   categoryId: カテゴリ ID。
 *
 * Returns:
 *   RankingResult 一覧（Participant, Country, Member を含む）。
 *   出場者名は大文字に正規化済み。
 */
export const findRankingResults = async (year: number, categoryId: number) => {
  const rows = await getDb().query.rankingResultTable.findMany({
    where: and(
      eq(rankingResultTable.year, year),
      eq(rankingResultTable.category, categoryId),
    ),
    with: {
      participantInfo: {
        with: {
          country: true,
          categoryInfo: true,
          members: { with: { country: true } },
        },
      },
    },
    orderBy: asc(rankingResultTable.rank),
  });

  for (const row of rows) {
    normalizeResultParticipant(row.participantInfo);
  }

  return rows;
};

export type RankingResultWithRelations = Awaited<
  ReturnType<typeof findRankingResults>
>[number];
