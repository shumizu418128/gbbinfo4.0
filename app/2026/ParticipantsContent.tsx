import type { ParticipantWithRelations } from "~/db/participant.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { getCountryName } from "~/util/country.js";
import { Flag } from "~/components/Flag.js";
import * as m from '../../paraglide/messages';
import { ParticipantAvatar } from "~/components/ParticipantAvatar.js";
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
        <div className="space-y-4">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="px-1 py-2 bg-opacity-10"
              style={{ backgroundColor: "var(--section-color)" }}
            >
              <div className="flex gap-2">
                <ParticipantAvatar src={`/images/${participant.name.toLowerCase()}.webp`} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xl">
                    {participant.isCancelled && (
                      <span className="text-red-400">{m.cancelled()} - </span>
                    )}
                    {participant.name}
                  </div>
                  <div className="pt-2">
                    {participant.country && (
                      <span><Flag isoAlpha2={participant.country.isoAlpha2} /> {getCountryName(participant.country, locale)}</span>
                    )}
                  </div>
                  <div className="text-sm pt-2 text-(--secondary-text-color)">
                    <span>{participant.ticketClass}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <SelectMenu label={selectedCategory} items={categoryItems} />
        </div>
      </div>
    </main>
  );
}
