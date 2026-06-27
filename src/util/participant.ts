import orderBy from "lodash/orderBy.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import {
  typeFromIsTeam,
  type ParticipantDetailPath,
  type ParticipantType,
} from "~/constants/participantType.js";
import { UNKNOWN_PARTICIPANT_NAME } from "@shared/participant/constants.js";

export { UNKNOWN_PARTICIPANT_NAME };

/**
 * 出場者未定の表示名かどうかを判定する。
 *
 * Args:
 *   name: 出場者名。
 *
 * Returns:
 *   未定の場合は true。
 */
export const isUnknownParticipantName = (name: string): boolean =>
  name === UNKNOWN_PARTICIPANT_NAME;

/** 参加者一覧ソートに必要な最小フィールド。 */
export type ParticipantSortable = {
  id: number;
  category: number;
  isCancelled: boolean;
  ticketClass: string;
  country?: { isoCode: number } | null;
};

type ParticipantUrlSource = {
  id: number;
  categoryInfo: { isTeam: boolean };
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

/**
 * Participant 行から詳細ページ path を組み立てる。
 *
 * Args:
 *   participant: Participant ID と Category.isTeam。
 *
 * Returns:
 *   single または team の path。
 */
export const participantDetailPathFromParticipant = (
  participant: ParticipantUrlSource,
): ParticipantDetailPath => ({
  id: participant.id,
  type: typeFromIsTeam(participant.categoryInfo.isTeam),
});

/**
 * ParticipantMember 行から詳細ページ path を組み立てる。
 *
 * Args:
 *   memberId: ParticipantMember の ID。
 *
 * Returns:
 *   member の path。
 */
export const participantDetailPathFromMember = (
  memberId: number,
): ParticipantDetailPath => ({
  id: memberId,
  type: "member",
});

/**
 * 詳細ページ path から URL を生成する。
 *
 * Args:
 *   locale: 表示言語。
 *   path: type と id が対応した path。
 *
 * Returns:
 *   詳細ページのパス。
 */
export const toParticipantDetailUrl = (
  locale: SupportedLanguage,
  path: ParticipantDetailPath,
): string => `/${locale}/participant/${path.type}/${path.id}`;

/**
 * Participant 詳細ページの URL を生成する。
 *
 * Args:
 *   locale: 表示言語。
 *   participant: 出場者 ID とチーム部門かどうか。
 *
 * Returns:
 *   `/{locale}/participant/{single|team}/{id}` 形式のパス。
 */
export const toParticipantUrl = (
  locale: SupportedLanguage,
  participant: { id: number; isTeam: boolean },
): string =>
  toParticipantDetailUrl(
    locale,
    participantDetailPathFromParticipant({
      id: participant.id,
      categoryInfo: { isTeam: participant.isTeam },
    }),
  );

/**
 * ParticipantMember 詳細ページの URL を生成する。
 *
 * Args:
 *   locale: 表示言語。
 *   memberId: ParticipantMember の ID。
 *
 * Returns:
 *   `/{locale}/participant/member/{id}` 形式のパス。
 */
export const toMemberUrl = (
  locale: SupportedLanguage,
  memberId: number,
): string =>
  toParticipantDetailUrl(locale, participantDetailPathFromMember(memberId));

/**
 * Participant 詳細ページへのリンクを返す。未定の出場者は undefined。
 *
 * Args:
 *   locale: 表示言語。
 *   participant: 出場者 ID・名前・チーム部門かどうか。
 *
 * Returns:
 *   詳細ページ URL。未定の場合は undefined。
 */
export const getParticipantDetailHref = (
  locale: SupportedLanguage,
  participant: { id: number; name: string; categoryInfo: { isTeam: boolean } },
): string | undefined => {
  if (isUnknownParticipantName(participant.name)) {
    return undefined;
  }
  return toParticipantUrl(locale, {
    id: participant.id,
    isTeam: participant.categoryInfo.isTeam,
  });
};

/**
 * ParticipantMember 詳細ページへのリンクを返す。未定のメンバーは undefined。
 *
 * Args:
 *   locale: 表示言語。
 *   member: メンバー ID と名前。
 *
 * Returns:
 *   詳細ページ URL。未定の場合は undefined。
 */
export const getMemberDetailHref = (
  locale: SupportedLanguage,
  member: { id: number; name: string },
): string | undefined => {
  if (isUnknownParticipantName(member.name)) {
    return undefined;
  }
  return toMemberUrl(locale, member.id);
};

/**
 * 過去出場履歴エントリの詳細ページへのリンクを返す。未定の出場者は undefined。
 *
 * Args:
 *   locale: 表示言語。
 *   entry: 過去出場履歴（名前・type・id）。
 *
 * Returns:
 *   詳細ページ URL。未定の場合は undefined。
 */
export const getPastParticipationDetailHref = (
  locale: SupportedLanguage,
  entry: { name: string; id: number; type: ParticipantType },
): string | undefined => {
  if (isUnknownParticipantName(entry.name)) {
    return undefined;
  }
  return toParticipantDetailUrl(locale, entry);
};
