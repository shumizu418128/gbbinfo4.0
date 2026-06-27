import type { ParticipantWithRelations } from "~/db/participant.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { categorySlug } from "~/util/category.js";
import { SelectMenu } from "~/components/SelectMenu.js";
import { ParticipantsCards } from "~/components/ParticipantsCards.js";
import { ParticipantWorldMap } from "~/components/ParticipantWorldMap.js";

type ParticipantsContentProps = {
  participants: ParticipantWithRelations[];
  locale: SupportedLanguage;
  selectedCategory: { name: string };
  year: number;
  categoryNames: string[];
};

export const ParticipantsContent = ({
  participants,
  locale,
  selectedCategory,
  year,
  categoryNames,
}: ParticipantsContentProps) => {
  const basePath = `/${locale}/${year}/participants`;
  const categoryItems = categoryNames.map((name) => ({
    key: name,
    href: `${basePath}/${categorySlug(name)}`,
    label: name,
    isActive: name === selectedCategory.name,
  }));

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-10 flex justify-center">
          <SelectMenu label={selectedCategory.name} items={categoryItems} />
        </div>

        <ParticipantsCards
          participants={participants}
          locale={locale}
          label={selectedCategory.name}
        />

        <div className="mt-10 flex justify-center">
          <SelectMenu label={selectedCategory.name} items={categoryItems} />
        </div>
      </div>

      <ParticipantWorldMap participants={participants} locale={locale} />
    </main>
  );
};
