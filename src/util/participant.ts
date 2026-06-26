import orderBy from "lodash/orderBy.js";

/** 参加者一覧ソートに必要な最小フィールド。 */
export type ParticipantSortable = {
  id: number;
  category: number;
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
 * 参加者一覧を表示順にソートする。
 *
 * 優先順位:
 *   1. 未キャンセルを上
 *   2. カテゴリ ID 昇順
 *   3. 出場者未定 (iso_codeが0) は下
 *   4. GBB Seed を上
 *   5. Wildcard 通過者を下
 *   6. Wildcard 同士は年・順位昇順
 *   7. それ以外は id 昇順
 *
 * Args:
 *   rows: ソート対象の参加者一覧。
 *
 * Returns:
 *   ソート済みの新しい配列。
 */
export const sortParticipants = <T extends ParticipantSortable>(
  rows: T[],
): T[] =>
  orderBy(
    rows,
    [
      (participant) => Number(participant.isCancelled),
      (participant) => participant.category,
      (participant) => Number(participant.country?.isoCode === 0),
      (participant) => Number(!participant.ticketClass.includes("GBB")),
      (participant) => Number(participant.ticketClass.includes("Wildcard")),
      (participant) => getWildcardRank(participant)[0],
      (participant) => getWildcardRank(participant)[1],
      (participant) => participant.id,
    ],
    ["asc", "asc", "asc", "asc", "asc", "asc", "asc", "asc"],
  );
