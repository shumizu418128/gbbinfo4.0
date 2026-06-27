import { UNKNOWN_PARTICIPANT_NAME } from "../../../shared/participant/constants.ts";
import { getDb } from "./client.ts";
import { participantMemberTable, participantTable } from "./schema.ts";

const normalizeParticipantName = (name: string): string => name.toUpperCase();

const isUnknownParticipantName = (name: string): boolean =>
  name === UNKNOWN_PARTICIPANT_NAME;

/**
 * Tavily 同期用に、Participant / ParticipantMember から一意の出場者名を収集する。
 *
 * Returns:
 *   大文字正規化済みの一意な名前一覧。
 */
export const findUniqueBeatboxerNames = async (): Promise<string[]> => {
  const db = getDb();
  const [participants, members] = await Promise.all([
    db.select({ name: participantTable.name }).from(participantTable),
    db.select({ name: participantMemberTable.name }).from(participantMemberTable),
  ]);

  const names = new Set<string>();
  for (const row of [...participants, ...members]) {
    const trimmed = row.name?.trim();
    if (trimmed && !isUnknownParticipantName(trimmed)) {
      names.add(normalizeParticipantName(trimmed));
    }
  }
  return [...names].sort();
};
