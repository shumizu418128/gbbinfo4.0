import {
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * 年度と開催日（docs/schema.md §3.3, docs/schema.sql `"Year"`）
 *
 * FK `Year_iso_code_fkey` → `Country(iso_code)` は Country 定義後に追加する。
 */
export const yearTable = pgTable("Year", {
  year: integer("year").primaryKey().notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  categories: integer("categories").array(),
  city: text("city"),
  isoCode: integer("iso_code"),
});

export type Year = typeof yearTable.$inferSelect;
