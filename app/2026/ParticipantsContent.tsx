import type { ParticipantWithRelations } from "~/db/participant.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { resolveParticipantCountries } from "~/util/country.js";
import { ParticipantCountries } from "~/components/ParticipantCountries.js";
import { ParticipantCard } from "~/components/ParticipantCard.js";
import { SelectMenu } from "~/components/SelectMenu.js";
import { useLocation } from "react-router";

type ParticipantsContentProps = {
  participants: ParticipantWithRelations[];
  locale: SupportedLanguage;
  categoryNames: string[];
  selectedCategory: string;
};

export const ParticipantsContent = ({ participants, locale, categoryNames, selectedCategory }: ParticipantsContentProps) => {
  const location = useLocation();

  const categoryItems = categoryNames.map((name) => ({
    key: name,
    href: `${location.pathname}?category=${encodeURIComponent(name)}`,
    label: name,
    isActive: name === selectedCategory,
  }));

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-10 flex justify-center">
          <SelectMenu label={selectedCategory} items={categoryItems} />
        </div>

        <div className="mb-6 text-center text-xl text-(--secondary-text-color)">
          {selectedCategory}: {participants.length} beatboxers
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
                  secondaryInfo={<span>{participant.ticketClass}</span>}
                />
              );
            })
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <SelectMenu label={selectedCategory} items={categoryItems} />
        </div>
      </div>
    </main>
  );
}
