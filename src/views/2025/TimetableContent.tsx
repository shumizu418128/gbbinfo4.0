import type { SupportedLanguage } from "~/constants/languageLabels.js";
import {
  CREW,
  LOOPSTATION,
  PRODUCER,
  SEVEN_TO_SMOKE,
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

  const tableHeader = [m.timetable_time(), m.timetable_event()];

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className={paragraphClass}>{m.timetable_note_schedule()}</p>
        <p className={paragraphClass}>{m.timetable_historical_delay_note()}</p>
        <p className={paragraphClass}>{m.timetable_bilingual_tt_error()}</p>
        <p className={paragraphClass}>{m.timetable_historical_tt_error_note()}</p>

        <h2 className="mb-4 mt-16 text-xl font-bold">{m.rule_toc()}</h2>
        <ol className="mb-16 list-decimal space-y-2 pl-8">
          <li>
            <a href="#day1" className={anchorClass}>
              Day1 - 10/31
            </a>
          </li>
          <li>
            <a href="#day2" className={anchorClass}>
              Day2 - 11/1
            </a>
          </li>
          <li>
            <a href="#day3" className={anchorClass}>
              Day3 - 11/2
            </a>
          </li>
          <li>
            <a href="#seven-to-smoke" className={anchorClass}>
              7toSmoke - 11/3
            </a>
          </li>
        </ol>

        <h2 id="day1" className={sectionHeadingClass}>
          Day1 - 10/31
        </h2>
        <p className={paragraphClass}>EX THEATER ROPPONGI</p>
        <p className={paragraphClass}>JST GMT+9</p>
        <Table
          data={[
            tableHeader,
            ["14:00", m.timetable_doors_open()],
            ["14:55", m.timetable_surprise_guest()],
            ["15:15", m.timetable_opening()],
            ["-", "SPECIAL SHOWCASE"],
            ["-", m.timetable_crew_prelim({ Crew: CREW })],
            ["-", m.timetable_tag_team_prelim({ TagTeam: TAG_TEAM })],
            ["-", m.timetable_break()],
            ["-", "SPECIAL SHOWCASE"],
            ["-", m.timetable_crew_final({ Crew: CREW })],
            ["-", m.timetable_producer_prelim({ Producer: PRODUCER })],
            ["-", "SPECIAL SHOWCASE"],
            ["19:30", m.timetable_end()],
          ]}
          textCenter
        />
        <p className={paragraphClass}>{m.timetable_day1_stream_end_note()}</p>
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
          Day2 - 11/1
        </h2>
        <p className={paragraphClass}>EX THEATER ROPPONGI</p>
        <p className={paragraphClass}>JST GMT+9</p>
        <Table
          data={[
            tableHeader,
            ["13:00", m.timetable_doors_open()],
            ["13:45", m.timetable_surprise_guest()],
            ["14:15", m.timetable_opening()],
            ["", "SPECIAL SHOWCASE"],
            ["", m.timetable_loop_quarterfinal({ Loopstation: LOOPSTATION })],
            ["", m.timetable_break()],
            ["", m.timetable_solo_prelim({ Solo: SOLO })],
            ["", m.timetable_producer_prelim_2({ Producer: PRODUCER })],
            ["", "SPECIAL SHOWCASE"],
            ["19:12", m.timetable_end()],
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
          Day3 - 11/2
        </h2>
        <p className={paragraphClass}>EX THEATER ROPPONGI</p>
        <p className={paragraphClass}>JST GMT+9</p>
        <Table
          data={[
            tableHeader,
            ["13:15", m.timetable_doors_open()],
            ["14:00", m.timetable_surprise_guest()],
            ["14:30", m.timetable_opening()],
            ["", "SPECIAL SHOWCASE"],
            ["", m.timetable_loop_semifinal_final({ Loopstation: LOOPSTATION })],
            ["", m.timetable_solo_quarterfinal({ Solo: SOLO })],
            ["", m.timetable_break()],
            ["", m.timetable_producer_final({ Producer: PRODUCER })],
            ["", m.timetable_tag_team_semifinal({ TagTeam: TAG_TEAM })],
            ["", m.timetable_solo_semifinal({ Solo: SOLO })],
            ["", m.timetable_tag_team_final({ TagTeam: TAG_TEAM })],
            ["", m.timetable_solo_final({ Solo: SOLO })],
            ["", "SPECIAL SHOWCASE"],
            ["19:58", m.timetable_ceremony()],
            ["21:00", m.timetable_end()],
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

        <h2 id="seven-to-smoke" className={sectionHeadingClass}>
          7toSmoke - 11/3
        </h2>
        <p className={paragraphClass}>Spotify O-EAST</p>
        <p className={paragraphClass}>JST GMT+9</p>
        <Table
          data={[
            tableHeader,
            ["14:20", m.timetable_doors_open()],
            ["15:00", m.timetable_start()],
            ["16:30", m.timetable_abema_stream_start()],
            [m.rule_update_pending(), m.timetable_end()],
          ]}
          textCenter
        />
        <p className={paragraphClass}>
          {m.timetable_7tosmoke_stream_timing_note({ SevenToSmoke: SEVEN_TO_SMOKE })}
        </p>
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.how_to_plan()}
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard text={SEVEN_TO_SMOKE} href={`/${locale}/${year}/top_7tosmoke`} />
        </div>
      </div>
    </main>
  );
};
