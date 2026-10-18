import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { SEVEN_TO_SMOKE } from "~/constants/i18nTerms.js";
import { LinkCard } from "~/components/LinkCard.js";
import * as m from "../../../paraglide/messages.js";

type Top7toSmokeContentProps = {
  locale: SupportedLanguage;
  year: number;
};

export const Top7toSmokeContent = ({ locale, year }: Top7toSmokeContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">

        <div className="mb-16 flex flex-wrap gap-4">
          <LinkCard
            text={m.top7tosmoke_about({ SevenToSmoke: SEVEN_TO_SMOKE })}
            image="/images/afterparty.webp"
            href={`/${locale}/others/7tosmoke`}
          />
          <LinkCard text={m.venue_tickets()} image="/images/dice.webp" href={`/${locale}/${year}/ticket`} />
          <LinkCard text={m.time_table()} image="/images/scott_jackson.webp" href={`/${locale}/${year}/timetable`} />
          <LinkCard text={m.livestream()} image="/images/sinjo.webp" href={`/${locale}/${year}/stream`} />
        </div>

        <div className="mb-16 flex flex-wrap gap-4">
          <LinkCard text={m.go_to_poland()} image="/images/zenhit.webp" href={`/${locale}/travel/top`} />
        </div>

      </div>
    </main>
  );
};
