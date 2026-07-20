import { LinkCard } from "~/components/LinkCard";
import { Table } from "~/components/Table";
import { SEVEN_TO_SMOKE, WILDCARD } from "~/constants/i18nTerms.js";
import { anchorClass } from "~/constants/linkStyle.js";
import * as m from "../../../paraglide/messages.js";
import type { YearWithCountry } from "~/db/year.js";

type TopContentProps = {
  locale: string;
  yearWithCountry: YearWithCountry;
};

export const TopContent = ({ locale, yearWithCountry }: TopContentProps) => {
  const { year } = yearWithCountry;
  const teamHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const teamLabel = locale === "ko" ? m.team_korea() : m.team_japan();
  const teamImage =
    locale === "ko" ? "/images/wing.webp" : "/images/mokbay.webp";

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-18 flex flex-wrap gap-4">
          <LinkCard
            text={<span>{m.wildcard_result({ Wildcard: WILDCARD })}<br />{m.participants()}</span>}
            image="/images/sora.webp"
            href={`/${locale}/${year}/participants`}
          />
          <LinkCard text={<span>{m.rules()}<br />{m.judges()}</span>} image="/images/mahiro.webp" href={`/${locale}/${year}/rule`} />
          <LinkCard text={m.time_table()} image="/images/scott_jackson.webp" href={`/${locale}/${year}/timetable`} unavailable />
          <LinkCard text={teamLabel} image={teamImage} href={teamHref} />
        </div>
        <div className="mb-18 flex flex-wrap gap-4">
          <LinkCard text={m.withdrawn_list()} image="/images/b4start.webp" href={`/${locale}/${year}/cancel`} />
          <LinkCard text={m.venue_tickets()} image="/images/dice.webp" href={`/${locale}/${year}/ticket`} />
          <LinkCard text={m.livestream()} image="/images/sinjo.webp" href={`/${locale}/${year}/stream`} unavailable />
          <LinkCard text={m.result()} image="/images/winner.webp" href={`/${locale}/${year}/result`} unavailable />
        </div>
      </div>

      <div className="flex justify-center w-full">
        <ul className="mb-18 w-full max-w-md list-disc space-y-4 px-8 text-left">
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
            <a href={`/${locale}/${year}/wildcards`} className={anchorClass}>
              {m.wildcard_list({ Wildcard: WILDCARD })}
            </a>
          </li>
          <li>
            <a
              href={`/${locale}/${year}/studio_competition`}
              className={anchorClass}
            >
              Studio Competition
            </a>
          </li>
        </ul>
      </div>

      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-18 flex flex-wrap gap-4">
          <LinkCard text={m.go_to_poland()} image="/images/zenhit.webp" href={`/${locale}/travel/top`} />
          <LinkCard text={SEVEN_TO_SMOKE} image="/images/afterparty.webp" href={`/${locale}/${year}/top_7tosmoke`} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="bg-(--section-color) p-8 text-white mt-22">
          <h2 className="text-2xl font-bold mb-2 text-center">{m.inquiry()}</h2>
          <hr className="border-(--gbb-color) mb-4" />
          <Table data={[["", "email"], [m.inquiry_ticket(), "gbb@swissbeatbox.com"], [m.inquiry_event(), "tickets@weeztix.com"]]} textCenter />
        </div>
      </div>
    </main>
  );
}
