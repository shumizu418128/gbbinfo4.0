import {
  bigint,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/** sync スクリプト用の最小 Participant 定義。 */
export const participantTable = pgTable("Participant", {
  id: integer("id").primaryKey(),
  name: varchar("name").notNull(),
});

/** sync スクリプト用の最小 ParticipantMember 定義。 */
export const participantMemberTable = pgTable("ParticipantMember", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: varchar("name").notNull(),
});

/** sync スクリプト用の Tavily 定義。 */
export const tavilyTable = pgTable("Tavily", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  cacheKey: text("cache_key").notNull().unique(),
  searchResults: jsonb("search_results").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  answerTranslation: jsonb("answer_translation").default({}).notNull(),
});

export type TavilyRow = typeof tavilyTable.$inferSelect;
