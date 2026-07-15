import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { SWISSBEATBOX, WILDCARD, YOUTUBE } from "~/constants/i18nTerms.js";
import { LinkCard } from "~/components/LinkCard.js";
import * as m from "../../../paraglide/messages.js";

type TicketContentProps = {
  locale: SupportedLanguage;
  year: number;
};

export const TicketContent = ({ locale, year }: TicketContentProps) => {
  const teamHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const teamLabel = locale === "ko" ? m.team_korea() : m.team_japan();

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className="mb-16 leading-relaxed">{m.ticket_online_stream({ year: String(year), Swissbeatbox: SWISSBEATBOX, YouTube: YOUTUBE })}</p>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={
              <span>
                {m.rules()}
                <br />
                {m.judges()}
              </span>
            }
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
        </div>
      </div>
    </main>
  );
};
