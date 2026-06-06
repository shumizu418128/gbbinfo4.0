import type { ParticipantWithRelations } from "~/db/participant.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { getCountryName } from "~/util/country.js";
import { Flag } from "~/components/Flag.js";
import { ParticipantAvatar } from "~/components/ParticipantAvatar.js";

export const ParticipantsContent = ({ participants, locale }: { participants: ParticipantWithRelations[], locale: SupportedLanguage }) => {
  return (
    // 仮設：とりあえず表示しただけ
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="space-y-4">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="p-2 bg-opacity-10"
              style={{ backgroundColor: "var(--section-color)" }}
            >
              <div className="flex gap-4">
                <ParticipantAvatar src={`/images/${participant.name.toLowerCase()}.webp`} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-lg">
                    {participant.isCancelled && (
                      <span className="text-red-400">キャンセル - </span>
                    )}
                    {participant.name}
                  </div>
                  <div className="text-sm pt-2">
                    {participant.country && (
                      <span><Flag isoAlpha2={participant.country.isoAlpha2} /> {getCountryName(participant.country, locale)}</span>
                    )}
                  </div>
                  <div className="text-sm pt-2">
                    <span>{participant.ticketClass}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
