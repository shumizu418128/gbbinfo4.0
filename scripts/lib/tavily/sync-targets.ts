import { UNKNOWN_PARTICIPANT_NAME } from "../../../shared/participant/constants.ts";
import { findUniqueBeatboxerNames } from "../db/participant-names.ts";

/** Tavily 同期対象外の Beatboxer 名（出場者未定など）。 */
export const TAVILY_SYNC_SKIP_NAMES = new Set([UNKNOWN_PARTICIPANT_NAME]);

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
