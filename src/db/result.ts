import { and, asc, eq } from "drizzle-orm";
import { getDb } from "./client.js";
import { rankingResultTable, tournamentResultTable } from "./tables.js";

/**
 * 指定年・カテゴリのトーナメント結果一覧を取得する。
 *
 * Args:
 *   year: 大会開催年。
 *   categoryId: カテゴリ ID。
 *
 * Returns:
 *   TournamentResult 一覧（winner/loser の Participant, Country, Member を含む）。
 */
export const findTournamentResults = async (year: number, categoryId: number) =>
  getDb().query.tournamentResultTable.findMany({
    where: and(
      eq(tournamentResultTable.year, year),
      eq(tournamentResultTable.category, categoryId),
    ),
    with: {
      winnerParticipant: {
        with: {
          country: true,
          members: { with: { country: true } },
        },
      },
      loserParticipant: {
        with: {
          country: true,
          members: { with: { country: true } },
        },
      },
    },
  });

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
 */
export const findRankingResults = async (year: number, categoryId: number) =>
  getDb().query.rankingResultTable.findMany({
    where: and(
      eq(rankingResultTable.year, year),
      eq(rankingResultTable.category, categoryId),
    ),
    with: {
      participantInfo: {
        with: {
          country: true,
          members: { with: { country: true } },
        },
      },
    },
    orderBy: asc(rankingResultTable.rank),
  });

export type RankingResultWithRelations = Awaited<
  ReturnType<typeof findRankingResults>
>[number];
