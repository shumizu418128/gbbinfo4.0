import type { ParticipantWithRelations } from "~/db/participant.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { resolveParticipantCountries } from "~/util/country.js";
import { ParticipantCountries } from "~/components/ParticipantCountries.js";
import { ParticipantCard } from "~/components/ParticipantCard.js";
import { getParticipantDetailHref } from "~/util/participant.js";

type ParticipantsCardsProps = {
  participants: ParticipantWithRelations[];
  locale: SupportedLanguage;
  label: string;
};

/**
 * 出場者カード一覧（件数表示 + カード）。
 *
 * SelectMenu やワールドマップは含まず、ParticipantsContent 側で前後に配置する。
 */
export const ParticipantsCards = ({
  participants,
  locale,
  label,
}: ParticipantsCardsProps) => (
  <>
    <div className="mb-6 text-center text-xl text-(--secondary-text-color)">
      {label}: {participants.filter((p) => !p.isCancelled).length} beatboxers
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
              secondaryInfo={<span>{participant.ticketClass}</span>}
            />
          );
        })
      )}
    </div>
  </>
);
