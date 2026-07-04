import { LinkCard } from "~/components/LinkCard";
import { Table } from "~/components/Table";
import { anchorClass } from "~/constants/linkStyle.js";
import * as m from "../../../paraglide/messages.js";
import type { YearWithCountry } from "~/db/year.js";

type TopContentProps = {
  locale: string;
  yearWithCountry: YearWithCountry;
};

export const TopContent = ({ locale, yearWithCountry }: TopContentProps) => {
  const { year } = yearWithCountry;
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-18 flex flex-wrap gap-4">
          <LinkCard
            text={<span>{m.wildcard_result({ Wildcard: "Wildcard" })}<br />{m.participants()}</span>}
            image="/images/sora.webp"
            href={`/${locale}/${year}/participants`}
          />
          <LinkCard text={<span>{m.rules()}<br />{m.judges()}</span>} image="/images/mahiro.webp" href={`/${locale}/${year}/rule`} />
          <LinkCard text={m.time_table()} image="/images/scott_jackson.webp" href={`/${locale}/${year}/timetable`} />
          <LinkCard text={m.team_japan()} image="/images/team_japan.webp" href={`/${locale}/${year}/japan`} />
        </div>
        <div className="mb-18 flex flex-wrap gap-4">
          <LinkCard text={m.withdrawn_list()} image="/images/b4start.webp" href={`/${locale}/${year}/cancel`} />
          <LinkCard text={m.venue_tickets()} image="/images/dice.webp" href={`/${locale}/${year}/ticket`} />
          <LinkCard text={m.livestream()} image="/images/sinjo.webp" href={`/${locale}/${year}/stream`} />
          <LinkCard text={m.result()} image="/images/winner.webp" href={`/${locale}/${year}/result`} />
        </div>
      </div>

      <div className="flex justify-center w-full">
        <ul className="w-full max-w-md list-disc text-left px-12 gap-6 mb-18">
          <li>
            <a
              href={`/${locale}/others/url_change`}
              className={anchorClass}
            >
              {m.site_url_notice()}
            </a>
          </li>
          <li>
            <a
              href={`/${locale}/others/result_stream`}
              className={anchorClass}
            >
              {m.wildcard_stream({ Wildcard: "Wildcard" })}
            </a>
          </li>
          <li>
            <a
              href={`/${locale}/${year}/wildcards`}
              className={anchorClass}
            >
              {m.wildcard_list({ Wildcard: "Wildcard" })}
            </a>
          </li>
        </ul>
      </div>

      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-18 flex flex-wrap gap-4">
          <LinkCard
            text={m.how_to_plan()}
            image="/images/zenhit.webp"
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard
            text="7toSmoke"
            image="/images/afterparty.webp"
            href={`/${locale}/${year}/top_7tosmoke`}
          />
        </div>
      </div>
    </main>
  );
}
