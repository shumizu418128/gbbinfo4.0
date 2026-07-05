import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { WILDCARD } from "~/constants/i18nTerms.js";
import { LinkCard } from "~/components/LinkCard.js";
import * as m from "../../../paraglide/messages.js";

type StreamContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const STREAM_LINKS = [
  { label: "Day1 10/31", href: "https://www.youtube.com/watch?v=kCJvevrV4aA" },
  { label: "Day2 11/1", href: "https://www.youtube.com/watch?v=IXLgPzCCXUQ" },
  { label: "Day3 11/2", href: "https://www.youtube.com/watch?v=zeAZyT5y7do" },
  {
    label: "7toSmoke 11/3",
    href: "https://abema.tv/live-event/1d1538de-2d88-4c50-99ac-bd58bec96e0a",
  },
] as const;

export const StreamContent = ({ locale, year }: StreamContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="flex flex-wrap gap-4">
          {STREAM_LINKS.map(({ label, href }) => (
            <LinkCard key={href} text={label} href={href} />
          ))}
        </div>

        <div className="mb-16">
          <h2 className="mb-8 text-xl font-bold">{m.stream_companion_title()}</h2>
          <p className="mb-8 text-(--secondary-text-color)">
            {m.stream_check_latest({ year: String(year) })}
          </p>
          <div className="flex flex-wrap gap-4">
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
            <LinkCard
              text={m.time_table()}
              href={`/${locale}/${year}/timetable`}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
