/*
 * Supabase からビルド用スナップショットを一括取得し `.cache/build/` に保存する。
 * astro build の前に実行される。
 *
 * Usage:
 *   npm run sync:build-cache
 *   npm run sync:build-cache -- --skip
 *   npm run sync:build-cache -- --skip-if-fresh
 *   npm run sync:build-cache -- --force
 */

import { closeDb } from "@shared/db/client.js";
import { fetchBuildCacheSnapshot } from "../lib/build-cache/fetch-snapshot.ts";
import {
  isBuildCacheFresh,
  writeBuildCacheSnapshot,
} from "../lib/build-cache/write-snapshot.ts";
import { loadDotEnv } from "../lib/load-dotenv.ts";

const main = async (): Promise<void> => {
  loadDotEnv();

  const force = process.argv.includes("--force");
  const skip = process.argv.includes("--skip") && !force;

  if (skip) {
    console.log("Build cache sync skipped");
    return;
  }

  const skipIfFresh =
    process.argv.includes("--skip-if-fresh") && !force;

  if (skipIfFresh && isBuildCacheFresh(false)) {
    console.log("Build cache is fresh, skipping sync");
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  console.log("[build-cache] Starting snapshot sync...");
  const snapshot = await fetchBuildCacheSnapshot();
  console.log("[build-cache] Writing snapshot to .cache/build/...");
  writeBuildCacheSnapshot(snapshot);

  console.log(
    `[build-cache] Wrote snapshot: ${snapshot.years.length} years, ${snapshot.participants.length} participants, ${snapshot.members.length} members, ${snapshot.tavily.length} tavily rows`,
  );
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDb();
  });
