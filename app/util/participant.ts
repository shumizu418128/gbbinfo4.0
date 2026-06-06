/** 参加者一覧ソートに必要な最小フィールド。 */
export type ParticipantSortable = {
  id: number;
  isCancelled: boolean;
  ticketClass: string;
  country?: { isoCode: number } | null;
};

/**
 * Wildcard 出場権の年・順位を比較用タプルに変換する。
 *
 * Args:
 *   participant: ticketClass を持つ参加者。
 *
 * Returns:
 *   [年, 順位]。Wildcard でない場合は [Infinity, Infinity]。
 */
const getWildcardRank = (
  participant: Pick<ParticipantSortable, "ticketClass">,
): [number, number] => {
  const m =
    participant.ticketClass && participant.ticketClass.includes("Wildcard")
      ? participant.ticketClass.match(/Wildcard\s+(\d+)(?:\s*\((\d{4})\))?/)
      : null;
  if (m) {
    const rank = parseInt(m[1], 10);
    const year = m[2] ? parseInt(m[2], 10) : 0;
    return [year, rank];
  }
  return [Infinity, Infinity];
};

/**
 * 参加者2件の表示順を比較する。
 *
 * 優先順位:
 *   1. 未キャンセルを上
 *   2. 出場者未定は下
 *   3. GBB Seed を上
 *   4. Wildcard 通過者を下
 *   5. Wildcard 同士は年・順位昇順
 *   6. それ以外は id 昇順
 *
 * Args:
 *   a: 比較対象の参加者。
 *   b: 比較対象の参加者。
 *
 * Returns:
 *   Array.sort 用の比較結果。
 */
export const compareParticipants = (
  a: ParticipantSortable,
  b: ParticipantSortable,
): number => {
  if (a.isCancelled !== b.isCancelled) {
    return a.isCancelled ? 1 : -1;
  }

  const isoA = a.country?.isoCode || "";
  const isoB = b.country?.isoCode || "";
  if ((isoA === 0) !== (isoB === 0)) {
    return isoA === 0 ? 1 : -1;
  }

  if ((a.ticketClass.includes("GBB")) !== (b.ticketClass.includes("GBB"))) {
    return a.ticketClass.includes("GBB") ? -1 : 1;
  }

  const isAWildcard =
    typeof a.ticketClass === "string" && a.ticketClass.includes("Wildcard");
  const isBWildcard =
    typeof b.ticketClass === "string" && b.ticketClass.includes("Wildcard");
  if (isAWildcard !== isBWildcard) {
    return isAWildcard ? 1 : -1;
  }

  if (isAWildcard && isBWildcard) {
    const [yearA, rankA] = getWildcardRank(a);
    const [yearB, rankB] = getWildcardRank(b);
    if (yearA !== yearB) return yearA - yearB;
    if (rankA !== rankB) return rankA - rankB;
    return a.id - b.id;
  }

  return a.id - b.id;
};

/**
 * 参加者一覧を表示順にソートする。
 *
 * Args:
 *   rows: ソート対象の参加者一覧。
 *
 * Returns:
 *   ソート済みの同一配列。
 */
export const sortParticipants = <T extends ParticipantSortable>(
  rows: T[],
): T[] => {
  rows.sort(compareParticipants);
  return rows;
};
