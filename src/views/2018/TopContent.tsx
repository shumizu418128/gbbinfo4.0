import { LinkCard } from "~/components/LinkCard";
import { SEVEN_TO_SMOKE, WILDCARD } from "~/constants/i18nTerms.js";
import { anchorClass } from "~/constants/linkStyle.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import type { YearWithCountry } from "~/db/year.js";
import * as m from "../../../paraglide/messages.js";

type TopContentProps = {
  locale: SupportedLanguage;
  yearWithCountry: YearWithCountry;
};

export const TopContent = ({ locale, yearWithCountry }: TopContentProps) => {
  const { year } = yearWithCountry;
  const teamHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const teamLabel = locale === "ko" ? m.team_korea() : m.team_japan();

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className="mb-8 text-center">{m.top_2018_dates()}</p>
        <p className="mb-16 text-center">{m.top_site_description()}</p>

        <div className="mb-16 flex flex-wrap gap-4">
          <LinkCard
            text={
              <span>
                {m.wildcard_result({ Wildcard: WILDCARD })}
                <br />
                {m.participants()}
              </span>
            }
            image="/images/sora.webp"
            href={`/${locale}/${year}/participants`}
          />
          <LinkCard
            text={m.how_to_plan()}
            image="/images/zenhit.webp"
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard
            text={
              <span>
                {m.rules()}
                <br />
                {m.judges()}
              </span>
            }
            image="/images/mahiro.webp"
            href={`/${locale}/${year}/rule`}
          />
          <LinkCard
            text={m.venue_tickets()}
            image="/images/dice.webp"
            href={`/${locale}/${year}/ticket`}
          />
          <LinkCard text={teamLabel} image="/images/team_japan.webp" href={teamHref} />
          <LinkCard text={m.result()} image="/images/winner.webp" href={`/${locale}/${year}/result`} />
        </div>
      </div>

      <div className="flex justify-center w-full">
        <ul className="mb-16 w-full max-w-md list-disc gap-6 px-12 text-left">
          <li>
            <a href={`/${locale}/others/url_change`} className={anchorClass}>
              {m.site_url_notice()}
            </a>
          </li>
          <li>
            <a href={`/${locale}/others/result_stream`} className={anchorClass}>
              {m.wildcard_stream({ Wildcard: WILDCARD })}
            </a>
          </li>
          <li>
            <a href={`/${locale}/others/7tosmoke`} className={anchorClass}>
              {m.seven_to_smoke_about({ SevenToSmoke: SEVEN_TO_SMOKE })}
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
};
