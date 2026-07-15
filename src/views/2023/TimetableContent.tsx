import type { ReactNode } from "react";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { LinkCard } from "~/components/LinkCard.js";
import { Table } from "~/components/Table.js";
import {
  CREW,
  LOOPSTATION,
  PRODUCER,
  SHOWCASE_WORD,
  SOLO,
  TAG_TEAM,
  WILDCARD,
} from "~/constants/i18nTerms.js";
import { anchorClass } from "~/constants/linkStyle.js";
import * as m from "../../../paraglide/messages.js";

type TimetableContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const GBB_VENUE = "EX THEATER ROPPONGI";
const DAY1 = "Day1 - 10/18";
const DAY2 = "Day2 - 10/19";
const DAY3 = "Day3 - 10/20";
const SPECIAL_SHOWCASE = "SPECIAL SHOWCASE - 10/21";

const paragraphClass = "mb-4 leading-relaxed text-(--secondary-text-color)";
const sectionHeadingClass = "mb-4 mt-16 text-2xl font-bold";

const u18Event = (roundLabel: string): ReactNode => (
  <>
    U18{" "}
    {roundLabel}
  </>
);

export const TimetableContent = ({ locale, year }: TimetableContentProps) => {
  const teamHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const teamLabel = locale === "ko" ? m.team_korea() : m.team_japan();

  const tableHeader = [m.timetable_time(), m.timetable_event()];

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className={paragraphClass}>{m.timetable_en_source_discrepancy()}</p>
        <p className={paragraphClass}>{m.timetable_bilingual_tt_error()}</p>

        <h2 className="mb-4 mt-16 text-xl font-bold">{m.rule_toc()}</h2>
        <ol className="mb-16 list-decimal space-y-2 pl-8">
          <li>
            <a href="#day1" className={anchorClass}>
              {DAY1}
            </a>
          </li>
          <li>
            <a href="#day2" className={anchorClass}>
              {DAY2}
            </a>
          </li>
          <li>
            <a href="#day3" className={anchorClass}>
              {DAY3}
            </a>
          </li>
          <li>
            <a href="#showcase" className={anchorClass}>
              {SPECIAL_SHOWCASE}
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
          {DAY1}
        </h2>
        <p className={paragraphClass}>{GBB_VENUE}</p>
        <Table
          data={[
            tableHeader,
            ["13:15", m.timetable_doors_open()],
            ["14:00", m.timetable_start()],
            ["14:15", "Pe4enkata showcase"],
            ["14:30", `${PRODUCER} ${SHOWCASE_WORD}`],
            ["16:20", u18Event(m.timetable_u18_quarterfinal())],
            [
              "17:10",
              m.timetable_tag_team_showcase_prelim({
                TagTeam: TAG_TEAM,
                SHOWCASE: SHOWCASE_WORD,
              }),
            ],
            ["18:05", m.timetable_break()],
            ["18:55", u18Event(m.timetable_u18_semifinal())],
            [
              "19:25",
              m.timetable_crew_showcase_prelim({ Crew: CREW, SHOWCASE: SHOWCASE_WORD }),
            ],
            ["20:20", u18Event(m.timetable_u18_final_ceremony())],
            ["21:15", m.timetable_end()],
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
          {DAY2}
        </h2>
        <p className={paragraphClass}>{GBB_VENUE}</p>
        <Table
          data={[
            tableHeader,
            ["13:15", m.timetable_doors_open()],
            ["14:00", m.timetable_start()],
            ["14:05", "Mad Twinz showcase"],
            ["14:20", m.timetable_loop_quarterfinal({ Loopstation: LOOPSTATION })],
            ["16:00", m.timetable_crew_final_en_note({ Crew: CREW })],
            ["16:30", m.timetable_break()],
            ["17:20", `${PRODUCER} ${SHOWCASE_WORD}`],
            [
              "18:30",
              m.timetable_solo_showcase_prelim({ Solo: SOLO, SHOWCASE: SHOWCASE_WORD }),
            ],
            [
              "20:45",
              m.timetable_showcase_ceremony({
                Crew: CREW,
                Producer: PRODUCER,
                SHOWCASE: SHOWCASE_WORD,
              }),
            ],
            ["21:15", m.timetable_end()],
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
          {DAY3}
        </h2>
        <p className={paragraphClass}>{GBB_VENUE}</p>
        <Table
          data={[
            tableHeader,
            ["13:15", m.timetable_doors_open()],
            ["14:00", m.timetable_start()],
            ["14:05", "Uniteam showcase"],
            [
              "14:25",
              m.timetable_loop_semifinal_final_only({ Loopstation: LOOPSTATION }),
            ],
            ["16:00", m.timetable_solo_quarterfinal({ Solo: SOLO })],
            ["16:50", m.timetable_break()],
            ["17:35", "SKILLER showcase"],
            ["17:50", m.timetable_tag_team_semifinal({ TagTeam: TAG_TEAM })],
            ["18:20", m.timetable_solo_semifinal({ Solo: SOLO })],
            ["18:45", m.timetable_tag_team_final_only({ TagTeam: TAG_TEAM })],
            ["19:15", m.timetable_solo_final_only({ Solo: SOLO })],
            [
              "19:40",
              m.timetable_main_ceremony({
                Solo: SOLO,
                TagTeam: TAG_TEAM,
                Loopstation: LOOPSTATION,
              }),
            ],
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

        <h2 id="showcase" className={sectionHeadingClass}>
          {SPECIAL_SHOWCASE}
        </h2>
        <p className={paragraphClass}>{GBB_VENUE}</p>
        <Table
          data={[
            tableHeader,
            ["15:30", m.timetable_doors_open()],
            ["16:15", m.timetable_start()],
            ["16:20", "FootboxG"],
            ["16:40", "Tom Thum"],
            ["17:10", "SARO + Rythmind"],
            ["17:50", "Gene shinozaki"],
            ["18:15", m.timetable_break()],
            ["19:25", m.timetable_secret_guest_note()],
            ["19:55", m.timetable_berywam_note()],
            ["20:30", "Beardyman"],
            ["21:10", m.timetable_end()],
          ]}
          textCenter
        />
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard text={m.livestream()} href={`/${locale}/${year}/stream`} />
          <LinkCard text={teamLabel} href={teamHref} />
        </div>
      </div>
    </main>
  );
};
