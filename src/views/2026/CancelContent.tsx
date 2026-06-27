import type { ParticipantWithRelations } from "~/db/participant.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { resolveParticipantCountries } from "~/util/country.js";
import { ParticipantCountries } from "~/components/ParticipantCountries.js";
import { getParticipantDetailHref } from "~/util/participant.js";
import { ParticipantCard } from "~/components/ParticipantCard.js";

type CancelContentProps = {
  participants: ParticipantWithRelations[];
  locale: SupportedLanguage;
};

export const CancelContent = ({ participants, locale }: CancelContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-6 text-center text-xl text-(--secondary-text-color)">
          {participants.length} beatboxers
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
                  href={getParticipantDetailHref(locale, participant)}
                  primaryInfo={
                    countries.length > 0 ? (
                      <ParticipantCountries countries={countries} locale={locale} />
                    ) : undefined
                  }
                  secondaryInfo={<span>{participant.categoryInfo.name}</span>}
                />
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};
