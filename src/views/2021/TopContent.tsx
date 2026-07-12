import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { LinkCard } from "~/components/LinkCard.js";
import { SEVEN_TO_SMOKE, WILDCARD } from "~/constants/i18nTerms.js";
import { anchorClass } from "~/constants/linkStyle.js";
import * as m from "../../../paraglide/messages.js";

type TopContentProps = {
  locale: SupportedLanguage;
  year: number;
};

export const TopContent = ({ locale, year }: TopContentProps) => {
  const teamHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const teamLabel = locale === "ko" ? m.team_korea() : m.team_japan();
  const teamImage =
    locale === "ko" ? "/images/wing.webp" : "/images/team_japan.webp";

  return (
    <main
      className="pt-16 pb-8 text-white"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-16 flex flex-wrap gap-4">
          <LinkCard
            text={<span>{m.wildcard_result({ Wildcard: WILDCARD })}<br />{m.participants()}</span>}
            image="/images/sora.webp"
            href={`/${locale}/${year}/participants`}
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
          <LinkCard
            text={m.time_table()}
            image="/images/scott_jackson.webp"
            href={`/${locale}/${year}/timetable`}
          />
          <LinkCard
            text={teamLabel}
            image={teamImage}
            href={teamHref}
          />
          <LinkCard
            text={m.result()}
            image="/images/winner.webp"
            href={`/${locale}/${year}/result`}
          />
        </div>

        <div className="flex justify-center">
          <ul className="w-full max-w-md list-disc space-y-4 px-8 text-left">
            <li>
              <a href={`/${locale}/others/url_change`} className={anchorClass}>
                {m.site_url_notice()}
              </a>
            </li>
            <li>
              <a
                href={`/${locale}/others/result_stream`}
                className={anchorClass}
              >
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
      </div>
    </main>
  );
};
