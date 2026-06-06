import {
  bigint,
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * MARK: Category
 */
export const categoryTable = pgTable("Category", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name").notNull().unique(),
  isTeam: boolean("is_team").default(false).notNull(),
});

export type Category = typeof categoryTable.$inferSelect;

/**
 * MARK: Country
 */
export const countryTable = pgTable("Country", {
  isoCode: integer("iso_code").primaryKey().notNull(),
  latitude: numeric("latitude").default("0").notNull(),
  longitude: numeric("longitude").default("0").notNull(),
  names: jsonb("names").notNull().unique(),
  enName: text("en_name"),
  jaName: text("ja_name"),
  isoAlpha2: text("iso_alpha2"),
});

export type Country = typeof countryTable.$inferSelect;

/**
 * MARK: Year
 */
export const yearTable = pgTable("Year", {
  year: integer("year").primaryKey().notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  categories: integer("categories").array(),
  city: text("city"),
  isoCode: integer("iso_code").references(() => countryTable.isoCode, {
    onDelete: "cascade",
  }),
});

/** Year テーブルの行のみ */
export type YearInfo = typeof yearTable.$inferSelect;

/** Year テーブルの行と Country テーブルの行を結合したもの */
export type YearWithCountry = YearInfo & {
  country: Country;
};

/**
 * MARK: Participant
 */
export const participantTable = pgTable("Participant", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name").notNull(),
  year: integer("year")
    .notNull()
    .references(() => yearTable.year, { onDelete: "cascade" }),
  isoCode: integer("iso_code")
    .notNull()
    .references(() => countryTable.isoCode, { onDelete: "cascade" }),
  isCancelled: boolean("is_cancelled").default(false).notNull(),
  category: integer("category")
    .notNull()
    .references(() => categoryTable.id, { onDelete: "cascade" }),
  ticketClass: varchar("ticket_class").notNull(),
});

export type Participant = typeof participantTable.$inferSelect;

/**
 * MARK: ParticipantMember
 */
export const participantMemberTable = pgTable("ParticipantMember", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  participant: integer("participant")
    .notNull()
    .references(() => participantTable.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  isoCode: integer("iso_code")
    .notNull()
    .references(() => countryTable.isoCode, { onDelete: "cascade" }),
});

export type ParticipantMember = typeof participantMemberTable.$inferSelect;

/**
 * MARK: RankingResult
 */
export const rankingResultTable = pgTable("RankingResult", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  year: integer("year")
    .notNull()
    .references(() => yearTable.year, { onDelete: "cascade" }),
  category: integer("category")
    .notNull()
    .references(() => categoryTable.id, { onDelete: "cascade" }),
  round: varchar("round"),
  participant: integer("participant")
    .notNull()
    .references(() => participantTable.id, { onDelete: "cascade" }),
  rank: integer("rank").notNull(),
});

export type RankingResult = typeof rankingResultTable.$inferSelect;

/**
 * MARK: TournamentResult
 */
export const tournamentResultTable = pgTable("TournamentResult", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  year: integer("year")
    .notNull()
    .references(() => yearTable.year, { onDelete: "cascade" }),
  category: integer("category")
    .notNull()
    .references(() => categoryTable.id, { onDelete: "cascade" }),
  round: varchar("round").notNull(),
  winner: integer("winner")
    .notNull()
    .references(() => participantTable.id, { onDelete: "cascade" }),
  loser: integer("loser")
    .notNull()
    .references(() => participantTable.id, { onDelete: "cascade" }),
});

export type TournamentResult = typeof tournamentResultTable.$inferSelect;

/**
 * MARK: Tavily
 */
export const tavilyTable = pgTable("Tavily", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  cacheKey: text("cache_key").notNull().unique(),
  searchResults: jsonb("search_results").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  answerTranslation: jsonb("answer_translation").default({}).notNull(),
});

export type Tavily = typeof tavilyTable.$inferSelect;
