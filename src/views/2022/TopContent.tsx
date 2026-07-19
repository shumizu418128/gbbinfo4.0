import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { SWISSBEATBOX } from "~/constants/i18nTerms.js";
import { LinkCard } from "~/components/LinkCard.js";
import { anchorClass } from "~/constants/linkStyle.js";
import * as m from "../../../paraglide/messages.js";

type TopContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const CANCEL_SOURCE_URL =
  "https://swissbeatbox.com/newsfeed/grand-beatbox-battle-2022-cancelled/";

export const TopContent = ({ locale, year }: TopContentProps) => {
  return (
    <main
      className="pt-16 pb-8 text-white"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className="mb-8 text-center text-6xl font-bold">
          {m.top_cancelled()}
        </p>

        <p className="mb-8 leading-relaxed text-(--secondary-text-color)">
          {m.top_cancelled_message({ Swissbeatbox: SWISSBEATBOX })}
        </p>

        <p className="mb-16 text-center">
          <a
            href={CANCEL_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            {m.top_cancelled_source()}
          </a>
        </p>

        <div className="flex flex-wrap gap-4">
          <LinkCard
            text="GBB 2021"
            href={`/${locale}/2021/top`}
          />
          <LinkCard
            text="GBB 2023"
            href={`/${locale}/2023/top`}
          />
        </div>
      </div>
    </main>
  );
};
