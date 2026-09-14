import { UNKNOWN_PARTICIPANT_NAME } from "../../../shared/participant/constants.ts";
import { findUniqueBeatboxerNames } from "@shared/db/participant-names.js";

/** Tavily 同期対象外の Beatboxer 名（出場者未定など）。 */
export const TAVILY_SYNC_SKIP_NAMES = new Set([UNKNOWN_PARTICIPANT_NAME]);

const normalizeBeatboxerName = (value: string): string =>
  value.trim().toLowerCase().replace(/['’]/g, "");

/**
 * `--name` / `--name=` から同期対象名フィルタを取る。
 *
 * Args:
 *   argv: process.argv。
 *
 * Returns:
 *   指定があれば名前。なければ undefined。
 */
export const parseTavilyNameFilter = (argv: string[]): string | undefined => {
  const flagIndex = argv.findIndex(
    (arg) => arg === "--name" || arg.startsWith("--name="),
  );
  if (flagIndex < 0) {
    return undefined;
  }
  const flag = argv[flagIndex] ?? "";
  if (flag.startsWith("--name=")) {
    const value = flag.slice("--name=".length).trim();
    return value || undefined;
  }
  const value = argv[flagIndex + 1]?.trim();
  return value || undefined;
};

/**
 * `--name` 指定があれば対象名に絞り込む。
 *
 * Args:
 *   names: 同期対象名。
 *   nameFilter: `--name` の値。
 *
 * Returns:
 *   絞り込んだ名前配列。
 *
 * Raises:
 *   Error: 一致する名前が無い場合。
 */
export const filterTavilySyncNames = (
  names: string[],
  nameFilter: string | undefined,
): string[] => {
  if (!nameFilter) {
    return names;
  }
  const matched = names.filter(
    (name) => normalizeBeatboxerName(name) === normalizeBeatboxerName(nameFilter),
  );
  if (matched.length === 0) {
    throw new Error(`No Tavily sync target matches --name ${nameFilter}`);
  }
  return matched;
};

/**
 * Tavily 同期対象の一意 Beatboxer 名一覧を返す。
 *
 * Returns:
 *   同期対象外を除いた名前の配列。
 */
export const findTavilySyncTargetNames = async (): Promise<string[]> => {
  const names = await findUniqueBeatboxerNames();
  return names.filter((name) => !TAVILY_SYNC_SKIP_NAMES.has(name));
};
