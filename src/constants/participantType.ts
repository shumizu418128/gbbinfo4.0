/** 出場者詳細ページの URL type（3.0 mode との対応: single, team, team_member→member）。 */
export const participantTypes = ["single", "team", "member"] as const;

export type ParticipantType = (typeof participantTypes)[number];

export type ParticipantPeerType = "single" | "team";

/** 詳細ページ URL に使う type と id の組（1 エンティティにつき 1 組のみ有効）。 */
export type ParticipantDetailPath = {
  id: number;
  type: ParticipantType;
};

/**
 * 文字列が ParticipantType かどうかを判定する。
 *
 * Args:
 *   value: 判定対象の文字列。
 *
 * Returns:
 *   ParticipantType であれば true。
 */
export const isParticipantType = (value: string): value is ParticipantType =>
  (participantTypes as readonly string[]).includes(value);

/**
 * Category.isTeam から single / team type を決定する。
 *
 * Args:
 *   isTeam: チーム部門かどうか。
 *
 * Returns:
 *   URL type（single または team）。
 */
export const typeFromIsTeam = (isTeam: boolean): ParticipantPeerType =>
  isTeam ? "team" : "single";

/**
 * 詳細ページ type から、同部門他出場者リンク用の peer type を返す。
 *
 * Args:
 *   type: 現在ページの type。
 *
 * Returns:
 *   single または team。
 */
export const peerTypeForDetail = (type: ParticipantType): ParticipantPeerType =>
  type === "single" ? "single" : "team";
