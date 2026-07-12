/*
 * Supabase（Postgres）の public スキーマ全テーブルを CSV で backup/ に保存する。
 *
 * Usage:
 *   npm run backup:db
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { loadDotEnv } from "./lib/load-dotenv.ts";

const ROOT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const BACKUP_ROOT = path.join(ROOT_DIR, "backup");

type TableRef = {
  schema: string;
  name: string;
};

const escapeCsvCell = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }

  let text: string;
  if (value instanceof Date) {
    text = value.toISOString();
  } else if (typeof value === "bigint") {
    text = value.toString();
  } else if (typeof value === "object") {
    text = JSON.stringify(value);
  } else {
    text = String(value);
  }

  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
};

const rowsToCsv = (
  columns: string[],
  rows: Record<string, unknown>[],
): string => {
  const header = columns.map(escapeCsvCell).join(",");
  const lines = rows.map((row) =>
    columns.map((column) => escapeCsvCell(row[column])).join(","),
  );
  return `${[header, ...lines].join("\n")}\n`;
};

const formatTimestamp = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    "_",
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
};

const listPublicTables = async (
  sql: ReturnType<typeof postgres>,
): Promise<TableRef[]> => {
  const tables = await sql<TableRef[]>`
    SELECT
      table_schema AS schema,
      table_name AS name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;
  return tables;
};

const listColumns = async (
  sql: ReturnType<typeof postgres>,
  table: TableRef,
): Promise<string[]> => {
  const columns = await sql<{ name: string }[]>`
    SELECT column_name AS name
    FROM information_schema.columns
    WHERE table_schema = ${table.schema}
      AND table_name = ${table.name}
    ORDER BY ordinal_position
  `;
  return columns.map((column) => column.name);
};

const exportTable = async (
  sql: ReturnType<typeof postgres>,
  table: TableRef,
  outDir: string,
): Promise<number> => {
  const columns = await listColumns(sql, table);
  const rows = await sql<Record<string, unknown>[]>`
    SELECT * FROM ${sql(table.schema)}.${sql(table.name)}
  `;
  const csv = rowsToCsv(columns, rows);
  const filePath = path.join(outDir, `${table.name}.csv`);
  writeFileSync(filePath, csv, "utf-8");
  return rows.length;
};

const main = async (): Promise<void> => {
  loadDotEnv();

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const stamp = formatTimestamp(new Date());
  const outDir = path.join(BACKUP_ROOT, stamp);
  mkdirSync(outDir, { recursive: true });

  const sql = postgres(databaseUrl, {
    prepare: false,
    ssl: "require",
  });

  try {
    const tables = await listPublicTables(sql);
    if (tables.length === 0) {
      console.warn("No public tables found");
      return;
    }

    console.log(`Exporting ${tables.length} tables → ${path.relative(ROOT_DIR, outDir)}`);

    for (const table of tables) {
      const count = await exportTable(sql, table, outDir);
      console.log(`  ${table.name}: ${count} rows`);
    }

    console.log("Done");
  } finally {
    await sql.end({ timeout: 5 });
  }
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
