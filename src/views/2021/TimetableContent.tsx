import type { SupportedLanguage } from "~/constants/languageLabels.js";
import {
  CREW,
  LOOPSTATION,
  SHOWCASE,
  SEVEN_TO_SMOKE,
  SOLO,
  TAG_TEAM,
  TAG_TEAM_LOOPSTATION,
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

const TIMETABLE_PDF_URL =
  "https://drive.google.com/file/d/1b8VgRrqR--ePsVqJxva0jWMMvNcNGByy/view";

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
    <main
      className="pt-16 pb-8 text-white"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className={paragraphClass}>{m.timetable_timestamp_intro()}</p>
        <p className="mb-4">
          <a
            href={TIMETABLE_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            {m.timetable_pdf_link()}
          </a>
        </p>
        <p className={paragraphClass}>{m.timetable_no_7tosmoke_timestamps({ SevenToSmoke: SEVEN_TO_SMOKE })}</p>
        <p className={paragraphClass}>{m.timetable_delay_detail()}</p>

        <h2 className="mb-4 mt-16 text-xl font-bold">{m.rule_toc()}</h2>
        <ol className="mb-16 list-decimal space-y-2 pl-8">
          <li>
            <a href="#day1" className={anchorClass}>
              Day1 - 10/22
            </a>
          </li>
          <li>
            <a href="#day2" className={anchorClass}>
              Day2 - 10/23
            </a>
          </li>
          <li>
            <a href="#day3" className={anchorClass}>
              Day3 - 10/24
            </a>
          </li>
        </ol>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard text={m.how_to_plan()} href={`/${locale}/others/how_to_plan`} />
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
        </div>

        <h2 id="day1" className={sectionHeadingClass}>
          Day1 - 10/22
        </h2>
        <Table
          data={[
            tableHeader,
            ["19:41", "2:41", m.timetable_loop_prelim({ Loopstation: LOOPSTATION })],
            ["21:47", "4:47", "RUNNERS UP SHOWCASE"],
            ["23:27", "6:27", m.timetable_solo_prelim({ Solo: SOLO })],
            ["1:56", "8:56", "JUDGE SHOWCASE"],
          ]}
          textCenter
        />

        <h2 id="day2" className={sectionHeadingClass}>
          Day2 - 10/23
        </h2>
        <Table
          data={[
            tableHeader,
            [
              "19:04",
              "2:04",
              m.timetable_ttl_prelim({ TagTeamLoopstation: TAG_TEAM_LOOPSTATION }),
            ],
            ["19:41", "2:41", m.timetable_tag_team_prelim({ TagTeam: TAG_TEAM })],
            ["21:47", "4:47", SHOWCASE],
            [
              "22:05",
              "5:05",
              m.timetable_loop_quarterfinal({ Loopstation: LOOPSTATION }),
            ],
            [
              "23:35",
              "6:35",
              m.timetable_solo_final_tournament_r1({ Solo: SOLO }),
            ],
            ["1:01", "8:01", SHOWCASE],
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

        <h2 id="day3" className={sectionHeadingClass}>
          Day3 - 10/24
        </h2>
        <Table
          data={[
            tableHeader,
            ["19:10", "2:10", SHOWCASE],
            ["19:39", "2:39", m.timetable_crew_prelim({ Crew: CREW })],
            [
              "20:30",
              "3:30",
              m.timetable_loop_semifinal_final({ Loopstation: LOOPSTATION }),
            ],
            ["23:00", "6:00", "JUDGE SHOWCASE"],
            [
              "0:15",
              "7:15",
              m.timetable_tag_team_semifinal_final({ TagTeam: TAG_TEAM }),
            ],
            ["1:03", "8:03", m.timetable_solo_all_finals({ Solo: SOLO })],
            ["2:30", "9:30", SHOWCASE],
          ]}
          textCenter
        />

        <p className={`${paragraphClass} mt-8`}>{m.timetable_anecdote_p1({ SHOWCASE })}</p>
        <p className={paragraphClass}>{m.timetable_anecdote_p2()}</p>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard text={m.how_to_plan()} href={`/${locale}/others/how_to_plan`} />
          <LinkCard text={teamLabel} href={teamHref} />
        </div>
      </div>
    </main>
  );
};
