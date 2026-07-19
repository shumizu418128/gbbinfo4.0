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
              Day1 - 11/1
            </a>
          </li>
          <li>
            <a href="#day2" className={anchorClass}>
              Day2 - 11/2
            </a>
          </li>
          <li>
            <a href="#day3" className={anchorClass}>
              Day3 - 11/3
            </a>
          </li>
          <li>
            <a href="#seven-to-smoke" className={anchorClass}>
              7toSmoke - 11/4
            </a>
          </li>
          <li>
            <a href="#showcase" className={anchorClass}>
              SPECIAL SHOWCASE {m.participants_list()}
            </a>
          </li>
        </ol>

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

        <h2 id="day1" className={sectionHeadingClass}>
          Day1 - 11/1
        </h2>
        <p className={paragraphClass}>Toyosu PIT</p>
        <p className={paragraphClass}>JST GMT+9</p>
        <Table
          data={[
            tableHeader,
            ["14:05", m.timetable_doors_open()],
            ["14:30", m.timetable_abema_stream_start()],
            ["15:00", m.timetable_surprise_guest()],
            ["15:20", m.timetable_start()],
            ["-", "SPECIAL SHOWCASE"],
            ["-", m.timetable_crew_prelim({ Crew: CREW })],
            ["-", m.timetable_producer_prelim({ Producer: PRODUCER })],
            ["-", m.timetable_tag_team_prelim({ TagTeam: TAG_TEAM })],
            ["-", m.timetable_producer_semifinal({ Producer: PRODUCER })],
            ["21:00", m.timetable_end()],
          ]}
          textCenter
        />
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={
              <span>
                {m.wildcard_result({ Wildcard: WILDCARD })}
                <br />
                {m.participants()}
              </span>
            }
            href={`/${locale}/${year}/participants`}
            fullWidth
          />
        </div>

        <h2 id="day2" className={sectionHeadingClass}>
          Day2 - 11/2
        </h2>
        <p className={paragraphClass}>Toyosu PIT</p>
        <p className={paragraphClass}>JST GMT+9</p>
        <Table
          data={[
            tableHeader,
            ["13:00", m.timetable_doors_open()],
            ["13:30", m.timetable_abema_stream_start()],
            ["13:55", m.timetable_surprise_guest()],
            ["14:15", m.timetable_start()],
            ["-", "SPECIAL SHOWCASE"],
            ["-", m.timetable_loop_quarterfinal({ Loopstation: LOOPSTATION })],
            ["-", m.timetable_crew_final({ Crew: CREW })],
            ["-", m.timetable_producer_final({ Producer: PRODUCER })],
            ["-", m.timetable_solo_prelim({ Solo: SOLO })],
            ["21:00", m.timetable_end()],
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

        <h2 id="day3" className={sectionHeadingClass}>
          Day3 - 11/3
        </h2>
        <p className={paragraphClass}>Toyosu PIT</p>
        <p className={paragraphClass}>JST GMT+9</p>
        <Table
          data={[
            tableHeader,
            ["13:00", m.timetable_doors_open()],
            ["13:30", m.timetable_abema_stream_start()],
            ["13:55", m.timetable_surprise_guest()],
            ["14:30", m.timetable_start()],
            ["-", "SPECIAL SHOWCASE"],
            ["-", m.timetable_loop_semifinal_final({ Loopstation: LOOPSTATION })],
            ["-", m.timetable_solo_quarterfinal({ Solo: SOLO })],
            ["-", m.timetable_tag_team_semifinal({ TagTeam: TAG_TEAM })],
            ["-", m.timetable_solo_semifinal({ Solo: SOLO })],
            ["-", m.timetable_tag_team_final({ TagTeam: TAG_TEAM })],
            ["-", m.timetable_solo_final({ Solo: SOLO })],
            ["20:30", m.timetable_ceremony()],
            ["21:00", m.timetable_end()],
            ["22:00", m.timetable_afterparty()],
          ]}
          textCenter
        />
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={
              <span>
                {m.wildcard_result({ Wildcard: WILDCARD })}
                <br />
                {m.participants()}
              </span>
            }
            href={`/${locale}/${year}/participants`}
            fullWidth
          />
        </div>

        <h2 id="seven-to-smoke" className={sectionHeadingClass}>
          7toSmoke - 11/4
        </h2>
        <p className={paragraphClass}>Spotify O-EAST</p>
        <p className={paragraphClass}>JST GMT+9</p>
        <Table
          data={[
            tableHeader,
            ["15:00", m.timetable_doors_open()],
            ["15:40", m.timetable_start()],
            ["16:25", m.timetable_prelim()],
            ["17:00", m.timetable_abema_stream_start()],
            ["19:00", m.timetable_7tosmoke_main_announce()],
            ["19:15", m.timetable_7tosmoke_main_start()],
            ["20:35", m.timetable_ceremony()],
            ["20:40", "DJ SET"],
            ["21:10", "DJ SET"],
            ["22:00", m.timetable_end()],
          ]}
          textCenter
        />
        <p className={paragraphClass}>{m.timetable_7tosmoke_abema_timing_note({ SevenToSmoke: SEVEN_TO_SMOKE })}</p>
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.how_to_plan()}
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard text={SEVEN_TO_SMOKE} href={`/${locale}/${year}/top_7tosmoke`} />
        </div>

        <h2 id="showcase" className={sectionHeadingClass}>
          SPECIAL SHOWCASE
          <br />
          {m.participants_list()}
        </h2>
        <ul className="mb-8 list-disc space-y-2 pl-8 text-(--secondary-text-color)">
          <li>M.O.M.</li>
          <li>MAD TWINZ</li>
          <li>DHARNI</li>
          <li>SARUKANI</li>
          <li>BIZKIT</li>
          <li>BATACO</li>
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
