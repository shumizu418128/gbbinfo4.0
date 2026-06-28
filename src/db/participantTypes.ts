import type { ParticipantDetailPath } from "~/constants/participantType.js";
import type {
  Category,
  Country,
  Participant,
  ParticipantMember,
} from "./tables.js";

/** 過去出場履歴エントリ。 */
export type PastParticipationEntry = ParticipantDetailPath & {
  year: number;
  /** 表示名。single/team は出場者名、member は所属チーム名。 */
  name: string;
  category: string;
  categoryId: number;
  isCancelled: boolean;
};

/** Country 付き ParticipantMember。 */
export type ParticipantMemberWithCountry = ParticipantMember & {
  country: Country;
};

/** Country・Category・メンバー情報を含む Participant。 */
export type ParticipantWithRelations = Participant & {
  country: Country;
  categoryInfo: Category;
  members: ParticipantMemberWithCountry[];
};

/** 出場者詳細用 Participant。 */
export type ParticipantDetailParticipant = ParticipantWithRelations;

/** 出場者詳細用 ParticipantMember。 */
export type ParticipantDetailMember = {
  id: number;
  participant: number;
  name: string;
  isoCode: number;
  country: Country;
  participantInfo: ParticipantWithRelations;
};
