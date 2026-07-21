import { desc } from "drizzle-orm";
import { BUILD_CACHE_VERSION } from "../../../shared/build-cache/constants.ts";
import type { BuildCacheSnapshot } from "../../../shared/build-cache/types.ts";
import { getDb } from "@shared/db/client.js";
import { yearTable } from "@shared/db/tables.js";

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

const timed = async <T>(
  label: string,
  run: () => Promise<T>,
): Promise<T> => {
  const startedAt = Date.now();
  console.log(`[build-cache] ${label}...`);
  const result = await run();
  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  const count = Array.isArray(result) ? ` rows=${result.length}` : "";
  console.log(`[build-cache] ${label} done (${elapsed}s)${count}`);
  return result;
};

/**
 * Supabase からビルド用スナップショットを一括取得する。
 *
 * Returns:
 *   years / participants / members / tavily を含むスナップショット。
 */
export const fetchBuildCacheSnapshot = async (): Promise<BuildCacheSnapshot> => {
  const db = getDb();
  const startedAt = Date.now();
  console.log("[build-cache] Fetching 4 bulk queries...");

  const yearRows = await timed("years", () =>
    db.query.yearTable.findMany({
      with: { country: true },
      orderBy: desc(yearTable.year),
    }),
  );
  const participants = await timed("participants", () =>
    db.query.participantTable.findMany({
      with: participantWithRelationsQuery,
    }),
  );
  const members = await timed("members", () =>
    db.query.participantMemberTable.findMany({
      with: memberWithRelationsQuery,
    }),
  );
  const tavilyRows = await timed("tavily", () =>
    db.query.tavilyTable.findMany(),
  );

  // 中止年（例: 2022）は country が null でもページ表示用に含める。
  const years = yearRows.map((row) => ({
    year: row.year,
    startsAt: row.startsAt?.toISOString() ?? null,
    endsAt: row.endsAt?.toISOString() ?? null,
    categories: row.categories,
    city: row.city,
    isoCode: row.isoCode,
    country: row.country ?? null,
  }));

  const snapshotParticipants = participants.map((row) => {
    if (!row.country || !row.categoryInfo) {
      throw new Error(`Participant relations missing: id=${row.id}`);
    }
    return {
      id: row.id,
      name: row.name,
      year: row.year,
      isoCode: row.isoCode,
      isCancelled: row.isCancelled,
      category: row.category,
      ticketClass: row.ticketClass,
      country: row.country,
      categoryInfo: row.categoryInfo,
      members: row.members.map((member) => {
        if (!member.country) {
          throw new Error(
            `ParticipantMember country missing: id=${member.id}`,
          );
        }
        return {
          id: member.id,
          participant: member.participant,
          name: member.name,
          isoCode: member.isoCode,
          country: member.country,
        };
      }),
    };
  });

  const snapshotMembers = members.map((row) => {
    if (
      !row.country ||
      !row.participantInfo?.country ||
      !row.participantInfo.categoryInfo
    ) {
      throw new Error(`ParticipantMember relations missing: id=${row.id}`);
    }
    const participantInfo = row.participantInfo;
    return {
      id: row.id,
      participant: row.participant,
      name: row.name,
      isoCode: row.isoCode,
      country: row.country,
      participantInfo: {
        id: participantInfo.id,
        name: participantInfo.name,
        year: participantInfo.year,
        isoCode: participantInfo.isoCode,
        isCancelled: participantInfo.isCancelled,
        category: participantInfo.category,
        ticketClass: participantInfo.ticketClass,
        country: participantInfo.country,
        categoryInfo: participantInfo.categoryInfo,
        members: participantInfo.members.map((member) => {
          if (!member.country) {
            throw new Error(
              `ParticipantMember country missing: id=${member.id}`,
            );
          }
          return {
            id: member.id,
            participant: member.participant,
            name: member.name,
            isoCode: member.isoCode,
            country: member.country,
          };
        }),
      },
    };
  });

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`[build-cache] All queries finished (${elapsed}s)`);

  return {
    version: BUILD_CACHE_VERSION,
    generatedAt: new Date().toISOString(),
    years,
    allYears: yearRows.map((row) => row.year),
    participants: snapshotParticipants,
    members: snapshotMembers,
    tavily: tavilyRows.map((row) => ({
      id: row.id,
      cacheKey: row.cacheKey,
      searchResults: row.searchResults,
      createdAt: row.createdAt.toISOString(),
      answerTranslation: (row.answerTranslation ?? {}) as BuildCacheSnapshot["tavily"][number]["answerTranslation"],
    })),
  };
};
