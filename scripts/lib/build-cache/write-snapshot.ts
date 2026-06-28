import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  BUILD_CACHE_VERSION,
  BUILD_MANIFEST_FILE,
  BUILD_SNAPSHOT_FILE,
  LOCAL_BUILD_CACHE_DIR,
} from "../../../shared/build-cache/constants.ts";
import type {
  BuildCacheManifest,
  BuildCacheSnapshot,
} from "../../../shared/build-cache/types.ts";

/**
 * スナップショットを `.cache/build/` に書き出す。
 *
 * Args:
 *   snapshot: 書き出すスナップショット。
 */
export const writeBuildCacheSnapshot = (snapshot: BuildCacheSnapshot): void => {
  mkdirSync(LOCAL_BUILD_CACHE_DIR, { recursive: true });

  const snapshotPath = path.join(LOCAL_BUILD_CACHE_DIR, BUILD_SNAPSHOT_FILE);
  writeFileSync(snapshotPath, JSON.stringify(snapshot), "utf-8");

  const manifest: BuildCacheManifest = {
    version: BUILD_CACHE_VERSION,
    generatedAt: snapshot.generatedAt,
  };
  const manifestPath = path.join(LOCAL_BUILD_CACHE_DIR, BUILD_MANIFEST_FILE);
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
};

/**
 * 既存スナップショットが有効か判定する。
 *
 * Args:
 *   force: true のとき常に false（再取得が必要）。
 *
 * Returns:
 *   スキップ可能なら true。
 */
export const isBuildCacheFresh = (force: boolean): boolean => {
  if (force) {
    return false;
  }

  const manifestPath = path.join(LOCAL_BUILD_CACHE_DIR, BUILD_MANIFEST_FILE);
  const snapshotPath = path.join(LOCAL_BUILD_CACHE_DIR, BUILD_SNAPSHOT_FILE);

  if (!existsSync(manifestPath) || !existsSync(snapshotPath)) {
    return false;
  }

  try {
    const manifest = JSON.parse(
      readFileSync(manifestPath, "utf-8"),
    ) as BuildCacheManifest;
    return manifest.version === BUILD_CACHE_VERSION;
  } catch {
    return false;
  }
};
