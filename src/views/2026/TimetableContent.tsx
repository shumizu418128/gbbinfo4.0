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
            ["16:00", "23:00", m.timetable_opening_set()],
            ["16:15", "23:15", "GBB26 OFFICIAL OPENING"],
            ["16:35", "23:35", m.timetable_opening_showcase({ SHOWCASE })],
            ["16:55", "23:55", m.timetable_tag_team_prelim({ TagTeam: TAG_TEAM })],
            ["17:35", "00:35", SHOWCASE],
            ["17:45", "00:45", m.timetable_break()],
            ["18:40", "01:40", SHOWCASE],
            ["19:00", "02:00", m.timetable_loop_quarterfinal({ Loopstation: LOOPSTATION })],
            ["20:30", "03:30", SHOWCASE],
            ["21:00", "04:00", m.timetable_end()],
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
            ["15:55", "22:55", m.timetable_opening_showcase({ SHOWCASE })],
            ["16:15", "23:15", "GBB26 OFFICIAL OPENING"],
            ["16:25", "23:25", SHOWCASE],
            ["16:45", "23:45", m.timetable_loop_semifinal({ Loopstation: LOOPSTATION })],
            ["17:30", "00:30", SHOWCASE],
            ["17:45", "00:45", m.timetable_break()],
            ["18:40", "01:40", "ARTIST ON STAGE"],
            ["18:50", "01:50", SHOWCASE],
            ["19:10", "02:10", `${CREW} ${SHOWCASE}`],
            ["19:30", "02:30", "LEGACY BATTLE: CODFISH VS WING"],
            ["19:55", "02:55", m.timetable_solo_prelim({ Solo: SOLO })],
            ["22:00", "05:00", SHOWCASE],
            ["22:25", "05:25", m.timetable_end()],
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
            ["14:20", "21:20", m.timetable_opening_showcase({ SHOWCASE })],
            ["14:50", "21:50", "GBB26 OFFICIAL OPENING"],
            ["15:00", "22:00", m.timetable_solo_quarterfinal({ Solo: SOLO })],
            ["15:45", "22:45", m.timetable_crew_small_final({ Crew: CREW })],
            ["16:00", "23:00", m.timetable_crew_final({ Crew: CREW })],
            ["16:15", "23:15", m.timetable_break()],
            ["17:00", "00:00", SHOWCASE],
            ["17:25", "00:25", m.timetable_loop_small_final({ Loopstation: LOOPSTATION })],
            ["17:45", "00:45", m.timetable_loop_final_only({ Loopstation: LOOPSTATION })],
            ["18:05", "01:05", m.timetable_tag_team_semifinal({ TagTeam: TAG_TEAM })],
            ["18:30", "01:30", m.timetable_solo_semifinal({ Solo: SOLO })],
            ["18:55", "01:55", m.timetable_tag_team_small_final({ TagTeam: TAG_TEAM })],
            ["19:10", "02:10", m.timetable_tag_team_final_only({ TagTeam: TAG_TEAM })],
            ["19:20", "02:20", m.timetable_solo_small_final({ Solo: SOLO })],
            ["19:30", "02:30", m.timetable_solo_final_only({ Solo: SOLO })],
            ["19:45", "02:45", SHOWCASE],
            ["20:00", "03:00", SHOWCASE],
            ["20:45", "03:45", m.timetable_ceremony()],
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
