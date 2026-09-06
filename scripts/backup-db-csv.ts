/*
 * Supabase（Postgres）の public スキーマ全テーブルを CSV で backup/ に保存し、
 * origin/main からブランチを切って PR を作成する。
 *
 * Usage:
 *   npm run backup:db
 *   npm run backup:db -- --no-pr
 */

import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, writeFileSync } from "node:fs";
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

type TableExport = {
  name: string;
  rows: number;
};

type RunOptions = {
  cwd?: string;
};

type RunResult = {
  status: number;
  stdout: string;
  stderr: string;
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

const runCommand = (
  command: string,
  args: string[],
  options: RunOptions = {},
): RunResult => {
  const cwd = options.cwd ?? ROOT_DIR;
  const names =
    process.platform === "win32" ? [`${command}.exe`, command] : [command];

  let lastError: NodeJS.ErrnoException | undefined;
  for (const name of names) {
    const result = spawnSync(name, args, {
      cwd,
      encoding: "utf-8",
      windowsHide: true,
    });
    if (result.error) {
      lastError = result.error;
      continue;
    }
    return {
      status: result.status ?? 1,
      stdout: (result.stdout ?? "").trim(),
      stderr: (result.stderr ?? "").trim(),
    };
  }

  throw new Error(
    `${command} が見つかりません。PATH を確認してください` +
      (lastError?.message ? ` (${lastError.message})` : ""),
  );
};

const runOrThrow = (
  command: string,
  args: string[],
  options: RunOptions = {},
): string => {
  const result = runCommand(command, args, options);
  if (result.status !== 0) {
    const detail = result.stderr || result.stdout || `exit ${result.status}`;
    throw new Error(`\`${command} ${args.join(" ")}\` failed: ${detail}`);
  }
  return result.stdout;
};

const assertGhAuth = (): void => {
  const result = runCommand("gh", ["auth", "status"]);
  if (result.status !== 0) {
    throw new Error(
      "gh にログインしていません。gh auth login を実行するか、GH_TOKEN を設定してください",
    );
  }
};

const buildPrBody = (stamp: string, tables: TableExport[]): string => {
  const counts = tables
    .map((table) => `${table.name}: ${table.rows}`)
    .join(" / ");
  return [
    "## Summary",
    "- Supabase publicスキーマ全テーブルをCSVでバックアップした",
    `- 出力先は \`backup/${stamp}/\`（前回と同じ形式）`,
    "",
    "## Test plan",
    `- [ ] \`backup/${stamp}/\` に${tables.length}ファイルがあること`,
    "- [ ] 各CSVのヘッダーと行数がバックアップ実行結果と一致すること",
    `  - ${counts}`,
  ].join("\n");
};

const removeWorktree = (worktreeDir: string): void => {
  const result = runCommand("git", [
    "worktree",
    "remove",
    "--force",
    worktreeDir,
  ]);
  if (result.status !== 0) {
    console.warn(
      `Failed to remove worktree: ${result.stderr || result.stdout}`,
    );
  }
};

const createBackupPullRequest = (
  stamp: string,
  tables: TableExport[],
): string => {
  assertGhAuth();

  const dateStamp = stamp.slice(0, 8);
  const branchName = `chore/db-backup-${stamp.replace("_", "-")}`;
  const title = `chore: ${dateStamp}のDBバックアップを追加`;
  const relativeBackupDir = path.posix.join("backup", stamp);
  const worktreeDir = path.join(ROOT_DIR, ".cache", "backup-pr", stamp);

  runOrThrow("git", ["fetch", "origin", "main"]);
  runOrThrow("git", [
    "worktree",
    "add",
    "-b",
    branchName,
    worktreeDir,
    "origin/main",
  ]);

  try {
    cpSync(path.join(BACKUP_ROOT, stamp), path.join(worktreeDir, "backup", stamp), {
      recursive: true,
    });
    runOrThrow("git", ["add", relativeBackupDir], { cwd: worktreeDir });
    runOrThrow("git", ["commit", "-m", title], { cwd: worktreeDir });
    runOrThrow("git", ["push", "-u", "origin", "HEAD"], { cwd: worktreeDir });

    return runOrThrow("gh", [
      "pr",
      "create",
      "--base",
      "main",
      "--head",
      branchName,
      "--title",
      title,
      "--body",
      buildPrBody(stamp, tables),
    ]);
  } finally {
    removeWorktree(worktreeDir);
  }
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

    const tableExports: TableExport[] = [];
    for (const table of tables) {
      const count = await exportTable(sql, table, outDir);
      tableExports.push({ name: table.name, rows: count });
      console.log(`  ${table.name}: ${count} rows`);
    }

    if (process.argv.includes("--no-pr")) {
      console.log("Done (PR skipped)");
      return;
    }

    const prUrl = createBackupPullRequest(stamp, tableExports);
    console.log(`Pull request: ${prUrl}`);
    console.log("Done");
  } finally {
    await sql.end({ timeout: 5 });
  }
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
