import type { ParticipantWithRelations } from "~/db/participant.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { categorySlug } from "~/util/category.js";
import { SelectMenu } from "~/components/SelectMenu.js";
import { ParticipantsCards } from "~/components/ParticipantsCards.js";
import { LinkCard } from "~/components/LinkCard.js";
import { SHOWCASE } from "~/constants/i18nTerms.js";
import * as m from "../../../paraglide/messages.js";

const YEAR = 2024;

type ParticipantsContentProps = {
  participants: ParticipantWithRelations[];
  locale: SupportedLanguage;
  selectedCategory: { name: string };
  categoryNames: string[];
  avatarImageUrls: Record<string, string>;
};

export const ParticipantsContent = ({
  participants,
  locale,
  selectedCategory,
  categoryNames,
  avatarImageUrls,
}: ParticipantsContentProps) => {
  const basePath = `/${locale}/${YEAR}/participants`;
  const categoryItems = categoryNames.map((name) => ({
    key: name,
    href: `${basePath}/${categorySlug(name)}`,
    label: name,
    isActive: name === selectedCategory.name,
  }));

  const isShowcaseCategory = selectedCategory.name.toUpperCase().startsWith(SHOWCASE);

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
          avatarImageUrls={avatarImageUrls}
        />

        <div className="mt-10 flex justify-center">
          <SelectMenu label={selectedCategory.name} items={categoryItems} />
        </div>

        {isShowcaseCategory ? (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <LinkCard
              text={`${SHOWCASE} ${m.rules()}`}
              href={`/${locale}/${YEAR}/rule`}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};
