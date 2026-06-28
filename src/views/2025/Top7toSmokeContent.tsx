import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { LinkCard } from "~/components/LinkCard.js";
import * as m from "../../../paraglide/messages.js";

type Top7toSmokeContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const SEVEN_TO_SMOKE = "7toSmoke";

export const Top7toSmokeContent = ({ locale, year }: Top7toSmokeContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-16 text-center">
          <p className="mb-4 text-xl">7toSmoke: 11/3</p>
          <p className="text-(--secondary-text-color)">
            {m.top7tosmoke_tagline()}
            <br />
            {m.top7tosmoke_subtitle({ year: String(year), SevenToSmoke: SEVEN_TO_SMOKE })}
          </p>
        </div>

        <div className="mb-16 flex flex-wrap gap-4">
          <LinkCard
            text={m.seven_to_smoke_about({ SevenToSmoke: SEVEN_TO_SMOKE })}
            image="/images/afterparty.webp"
            href={`/${locale}/others/7tosmoke`}
          />
          <LinkCard
            text={m.seven_to_smoke_rules({ SevenToSmoke: SEVEN_TO_SMOKE })}
            image="/images/afterparty.webp"
            href={`/${locale}/others/7tosmoke`}
          />
          <LinkCard text={m.venue_tickets()} image="/images/dice.webp" href={`/${locale}/${year}/ticket`} />
          <LinkCard text={m.how_to_plan()} image="/images/zenhit.webp" href={`/${locale}/others/how_to_plan`} />
        </div>

        <div className="mb-16 flex flex-wrap gap-4">
          <LinkCard
            text={m.time_table()}
            image="/images/scott_jackson.webp"
            href={`/${locale}/${year}/timetable?scroll=7tosmoke`}
          />
          <LinkCard text={m.livestream()} image="/images/sinjo.webp" href={`/${locale}/${year}/stream`} />
        </div>

        <div className="mb-16 space-y-4 text-(--secondary-text-color)">
          <p>{m.top7tosmoke_info_delay({ SevenToSmoke: SEVEN_TO_SMOKE })}</p>
          <p>{m.top7tosmoke_give_up()}</p>
        </div>
      </div>
    </main>
  );
};
