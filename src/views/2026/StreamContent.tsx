import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { SWISSBEATBOX, WILDCARD, YOUTUBE } from "~/constants/i18nTerms.js";
import { LinkCard } from "~/components/LinkCard.js";
import * as m from "../../../paraglide/messages.js";

type StreamContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const STREAMS_URL = "https://www.youtube.com/@swissbeatbox/streams";

export const StreamContent = ({ locale, year }: StreamContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className="mb-8 text-(--secondary-text-color)">
          {m.stream_members_only({
            year: String(year),
            Swissbeatbox: SWISSBEATBOX,
            YouTube: YOUTUBE,
          })}
        </p>

        <div className="mb-16 flex flex-wrap gap-4">
          <LinkCard
            text={m.stream_watch_here()}
            href={STREAMS_URL}
            fullWidth
          />
        </div>

        <div className="mb-16">
          <h2 className="my-8 text-xl font-bold">{m.stream_companion_title()}</h2>
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
