import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { LinkCard } from "~/components/LinkCard.js";
import { anchorClass } from "~/constants/linkStyle.js";
import * as m from "../../../paraglide/messages.js";

type TimetableContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const paragraphClass = "mb-4 leading-relaxed text-(--secondary-text-color)";
const sectionHeadingClass = "mb-4 mt-16 text-2xl font-bold";

export const TimetableContent = ({ locale, year }: TimetableContentProps) => {
  const teamHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const teamLabel = locale === "ko" ? m.team_korea() : m.team_japan();

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className={paragraphClass}>{m.timetable_note_schedule()}</p>
        <p className={paragraphClass}>{m.timetable_note_delay()}</p>
        <p className={paragraphClass}>{m.timetable_note_past()}</p>

        <h2 className="mb-4 mt-16 text-xl font-bold">{m.rule_toc()}</h2>
        <ol className="mb-16 list-decimal space-y-2 pl-8">
          <li>
            <a href="#showcase" className={anchorClass}>
              SPECIAL SHOWCASE {m.participants_list()}
            </a>
          </li>
        </ol>

        <div className="mt-32 mb-4 text-3xl font-bold">Coming soon...</div>

        <h2 id="showcase" className={sectionHeadingClass}>
          SPECIAL SHOWCASE
          <br />
          {m.participants_list()}
        </h2>
        <ul className="mb-8 list-disc space-y-2 pl-8 text-(--secondary-text-color)">
          <li>SYJO</li>
          <li>COLAPS</li>
          <li>TECHTONIC</li>
          <li>HONEYCOMB</li>
          <li>MAXSKILL</li>
          <li>CODFISH</li>
          <li>RITHMIND</li>
          <li>M.O.M</li>
          <li>HISS AND WING</li>
        </ul>
        <p className={paragraphClass}>{m.timetable_showcase_performers_unknown()}</p>
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard text={m.livestream()} href={`/${locale}/${year}/stream`} />
          <LinkCard text={teamLabel} href={teamHref} />
        </div>
      </div>
    </main>
  );
};
