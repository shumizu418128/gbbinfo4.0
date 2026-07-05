import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { LinkCard } from "~/components/LinkCard.js";
import { WILDCARD } from "~/constants/i18nTerms.js";
import * as m from "../../../paraglide/messages.js";

type TicketContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const GBB_VENUE = "EX THEATER ROPPONGI";

export const TicketContent = ({ locale, year }: TicketContentProps) => {
  const teamHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const teamLabel = locale === "ko" ? m.team_korea() : m.team_japan();

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <ul className="mb-16 list-disc space-y-2 pl-8 text-base">
          <li>
            GBB {year} {m.ticket_venue()}：{GBB_VENUE}
          </li>
          <li>{m.ticket_sales_page()}：✖</li>
        </ul>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={<span>{m.rules()}<br />{m.judges()}</span>}
            href={`/${locale}/${year}/rule`}
          />
          <LinkCard
            text={
              <span>
                {m.wildcard_result({ Wildcard: WILDCARD })}
                <br />
                {m.participants()}
              </span>
            }
            href={`/${locale}/${year}/participants`}
          />
          <LinkCard text={teamLabel} href={teamHref} />
          <LinkCard
            text={m.time_table()}
            href={`/${locale}/${year}/timetable`}
          />
        </div>
      </div>
    </main>
  );
};
