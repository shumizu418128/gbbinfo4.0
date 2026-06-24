import type { ParticipantWithRelations } from "~/db/participant.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { resolveParticipantCountries } from "~/util/country.js";
import { ParticipantCountries } from "~/components/ParticipantCountries.js";
import { ParticipantCard } from "~/components/ParticipantCard.js";
import * as m from "../../../paraglide/messages.js";

type JapanContentProps = {
  participants: ParticipantWithRelations[];
  locale: SupportedLanguage;
};

export const JapanContent = ({ participants, locale }: JapanContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <h1 className="mb-8 text-2xl font-bold">{m.team_japan()}</h1>

        <div className="mb-6 text-center text-xl text-(--secondary-text-color)">
          {participants.filter((p) => !p.isCancelled).length} beatboxers
        </div>

        <div className="space-y-6">
          {participants.length === 0 ? (
            <div className="text-center text-2xl text-(--secondary-text-color) py-40">
              coming soon...
            </div>
          ) : (
            participants.map((participant) => {
              const countries = resolveParticipantCountries(participant);

              return (
                <ParticipantCard
                  key={participant.id}
                  name={participant.name}
                  isCancelled={participant.isCancelled}
                  primaryInfo={
                    countries.length > 0 ? (
                      <ParticipantCountries countries={countries} locale={locale} />
                    ) : undefined
                  }
                  secondaryInfo={
                    <span>{participant.categoryInfo.name} / {participant.ticketClass}</span>
                  }
                />
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};
