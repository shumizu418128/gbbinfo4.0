import type { SupportedLanguage } from "~/constants/languageLabels.js";
import {
  CREW,
  LOOPSTATION,
  SHOWCASE,
  SOLO,
  TAG_TEAM,
  WILDCARD,
} from "~/constants/i18nTerms.js";
import { LinkCard } from "~/components/LinkCard.js";
import { Table } from "~/components/Table.js";
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

  const tableHeader = [
    m.timetable_warsaw_time(),
    m.timetable_japan_time(),
    m.timetable_event(),
  ];

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className={paragraphClass}>{m.timetable_note_schedule()}</p>
        <p className={paragraphClass}>{m.timetable_note_outline_only()}</p>
        <p className={paragraphClass}>{m.timetable_note_cest()}</p>
        <p className={paragraphClass}>{m.timetable_note_delay()}</p>
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={`${m.reference_data()}：GBB 2021 ${m.time_table()}`}
            href={`/${locale}/2021/timetable`}
            fullWidth
          />
        </div>

        <h2 className="mb-4 mt-16 text-xl font-bold">{m.rule_toc()}</h2>
        <ol className="mb-16 list-decimal space-y-2 pl-8">
          <li>
            <a href="#day1" className={anchorClass}>
              Day1 - 9/24
            </a>
          </li>
          <li>
            <a href="#day2" className={anchorClass}>
              Day2 - 9/25
            </a>
          </li>
          <li>
            <a href="#day3" className={anchorClass}>
              Day3 - 9/26
            </a>
          </li>
          <li>
            <a href="#showcase" className={anchorClass}>
              SPECIAL SHOWCASE {m.participants_list()}
            </a>
          </li>
        </ol>

        <h2 id="day1" className={sectionHeadingClass}>
          Day1 - 9/24
        </h2>
        <Table
          data={[
            tableHeader,
            ["15:00", "22:00", m.timetable_doors_open()],
            ["16:15", "23:15", m.timetable_livestream_start()],
            ["-", "-", TAG_TEAM],
            ["-", "-", LOOPSTATION],
            ["-", "-", SHOWCASE],
          ]}
          textCenter
        />
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.how_to_plan()}
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard
            text={<span>{m.rules()}<br />{m.judges()}</span>}
            href={`/${locale}/${year}/rule`}
          />
        </div>

        <h2 id="day2" className={sectionHeadingClass}>
          Day2 - 9/25
        </h2>
        <Table
          data={[
            tableHeader,
            ["15:00", "22:00", m.timetable_doors_open()],
            ["16:15", "23:15", m.timetable_livestream_start()],
            ["-", "-", SOLO],
            ["-", "-", CREW],
            ["-", "-", LOOPSTATION],
            ["-", "-", SHOWCASE],
          ]}
          textCenter
        />
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard text={m.livestream()} href={`/${locale}/${year}/stream`} />
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
        </div>

        <h2 id="day3" className={sectionHeadingClass}>
          Day3 - 9/26
        </h2>
        <Table
          data={[
            tableHeader,
            ["13:30", "20:30", m.timetable_doors_open()],
            ["14:50", "21:50", m.timetable_livestream_start()],
            ["-", "-", SOLO],
            ["-", "-", TAG_TEAM],
            ["-", "-", CREW],
            ["-", "-", LOOPSTATION],
            ["-", "-", SHOWCASE],
          ]}
          textCenter
        />
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.how_to_plan()}
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard text={teamLabel} href={teamHref} />
        </div>

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
