/*
 * Supabase Tavily テーブルからローカルキャッシュへダウンロードする。
 * dev 時の参加者詳細表示は `.cache/tavily/{cache_key}.json` を参照する。
 *
 * Usage:
 *   npm run sync:tavily:cache
 *   npm run sync:tavily:cache -- --force
 *
 * ローカルキャッシュ: .cache/tavily/{cache_key}.json（gitignore 済み）
 */

import { toTavilyCacheKey } from "../../shared/tavily/cache-key.ts";
import { readLocalTavilyCache } from "../../shared/tavily/local-cache-read.ts";
import { loadDotEnv } from "../lib/load-dotenv.ts";
import { hydrateLocalCacheFromDb } from "../lib/tavily/db-sync.ts";
import { isLocalTavilyCacheComplete } from "../lib/tavily/local-cache-write.ts";
import { findTavilySyncTargetNames } from "../lib/tavily/sync-targets.ts";

const main = async (): Promise<void> => {
  loadDotEnv();

  const databaseUrl = process.env.DATABASE_URL;
  const force = process.argv.includes("--force");

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const names = await findTavilySyncTargetNames();
  console.log(`Found ${names.length} beatboxer names to download`);

  let downloaded = 0;
  let skipped = 0;
  let missing = 0;
  let failed = 0;

  for (const name of names) {
    const cacheKey = toTavilyCacheKey(name);

    try {
      if (!force) {
        const local = readLocalTavilyCache(cacheKey);
        if (local && isLocalTavilyCacheComplete(local)) {
          skipped += 1;
          continue;
        }
      }

      await hydrateLocalCacheFromDb(cacheKey, name);
      const cached = readLocalTavilyCache(cacheKey);

      if (!cached || !isLocalTavilyCacheComplete(cached)) {
        missing += 1;
        continue;
      }

      downloaded += 1;
    } catch (error) {
      failed += 1;
      console.error(`  Failed: ${name}`, error);
    }
  }

  console.log(
    `Done. downloaded=${downloaded}, skipped=${skipped}, missing=${missing}, failed=${failed}`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
