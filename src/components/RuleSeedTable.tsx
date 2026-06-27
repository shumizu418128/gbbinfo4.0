import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { Flag } from "~/components/Flag.js";
import type { ParticipantWithRelations } from "~/db/participant.js";
import { anchorClass } from "~/constants/linkStyle.js";
import { toParticipantUrl, isUnknownParticipantName } from "~/util/participant.js";
import * as m from "../../paraglide/messages.js";

type RuleSeedTableProps = {
  participants: ParticipantWithRelations[];
  cancelled?: boolean;
  locale: SupportedLanguage;
};

export const RuleSeedTable = ({
  participants,
  cancelled = false,
  locale,
}: RuleSeedTableProps) => {
  if (participants.length === 0) {
    return (
      <p className="mb-4 text-(--secondary-text-color) italic">
        {m.rule_update_pending()}
      </p>
    );
  }

  return (
    <table className="mx-auto mb-8 w-[95%] border-collapse text-sm">
      <thead>
        <tr className="border-b border-(--table-border-color) bg-(--section-color)">
          <th className="p-2 font-bold">{m.rule_col_category()}</th>
          <th className="p-2 font-bold">{m.rule_col_name()}</th>
          <th className="p-2 font-bold">{m.rule_col_ticket()}</th>
        </tr>
      </thead>
      <tbody>
        {participants.map((participant, index) => {
          const isoAlpha2 = participant.country.isoAlpha2?.toLowerCase() ?? null;
          const showFlag =
            !isUnknownParticipantName(participant.name) &&
            isoAlpha2 !== null &&
            !cancelled;

          return (
            <tr
              key={participant.id}
              className={index % 2 === 1 ? "bg-(--section-color)" : undefined}
            >
              <td className={`p-2 ${cancelled ? "line-through" : ""}`}>
                {participant.categoryInfo.name}
              </td>
              <td className="p-2">
                {cancelled ? (
                  <>
                    <span className="block">【{m.cancelled()}】</span>
                    {isoAlpha2 ? (
                      <Flag isoAlpha2={isoAlpha2} className="mr-1" />
                    ) : null}
                    <span className="line-through">{participant.name}</span>
                  </>
                ) : isUnknownParticipantName(participant.name) ? (
                  participant.name
                ) : (
                  <>
                    {showFlag ? (
                      <Flag isoAlpha2={isoAlpha2} className="mr-1" />
                    ) : null}
                    <a
                      href={toParticipantUrl(locale, {
                        id: participant.id,
                        isTeam: participant.categoryInfo.isTeam,
                      })}
                      className={anchorClass}
                    >
                      {participant.name}
                    </a>
                  </>
                )}
              </td>
              <td className={`p-2 ${cancelled ? "line-through" : ""}`}>
                {participant.ticketClass}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
