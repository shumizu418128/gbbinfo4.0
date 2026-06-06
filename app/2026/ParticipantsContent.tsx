import type { ParticipantWithRelations } from "~/db/participant.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { getCountryName } from "~/util/country.js";
import { Flag } from "~/components/Flag.js";

export const ParticipantsContent = ({ participants, locale }: { participants: ParticipantWithRelations[], locale: SupportedLanguage }) => {
  return (
    // 仮設：とりあえず表示しただけ
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="space-y-4">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="p-4 bg-opacity-10"
            >
              <div className="font-semibold text-lg mb-1">
                {participant.isCancelled && (
                  <span className="ml-2 text-red-400">キャンセル - </span>
                )}
                {participant.name}
              </div>
              <div className="text-sm">
                {participant.country && (
                  <span className="ml-2"><Flag isoAlpha2={participant.country.isoAlpha2} /> {getCountryName(participant.country, locale)}</span>
                )}
                <span className="ml-2">{participant.ticketClass}</span>
              </div>
              {participant.members && participant.members.length > 0 && (
                <div className="mt-2">
                  <div className="font-medium text-xs text-gray-400">メンバー:</div>
                  <ul className="list-disc pl-5">
                    {participant.members.map((member) => (
                      <li key={member.id} className="text-sm">
                        {member.name}
                        {member.country && (
                          <span className="ml-1 text-gray-300">({getCountryName(member.country, locale)})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
