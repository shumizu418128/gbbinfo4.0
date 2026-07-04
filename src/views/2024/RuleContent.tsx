import type { ReactNode } from "react";
import { LinkCard } from "~/components/LinkCard.js";
import { PostIt } from "~/components/PostIt.js";
import { RuleSeedTable } from "~/components/RuleSeedTable.js";
import { Table } from "~/components/Table.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { anchorClass } from "~/constants/linkStyle.js";
import type { ParticipantWithRelations } from "~/db/participant.js";
import * as m from "../../../paraglide/messages.js";

type RuleSeedData = {
  gbbSeed: ParticipantWithRelations[];
  otherSeed: ParticipantWithRelations[];
  cancelled: ParticipantWithRelations[];
};

type RuleContentProps = {
  locale: SupportedLanguage;
  year: number;
  seedData: RuleSeedData;
};

const WILDCARD = "Wildcard";
const PRODUCER = "Producer";
const LOOPSTATION = "Loopstation";
const TAG_TEAM = "Tag Team";
const CREW = "Crew";
const SWISSBEATBOX = "Swissbeatbox";
const RC505 = "RC505";
const SWISSBEATBOX_SOURCE =
  "https://swissbeatbox.com/newsfeed/gbb-2024-wildcard-competition-rules-and-application/";

const sectionClass = "mb-4 text-2xl font-bold";
const tocSectionClass = "mb-4 text-2xl font-bold";
const paragraphClass = "mb-4 leading-relaxed";
const subSectionClass = "mb-4 font-bold";
const ruleSubSectionClass = "mt-8 bg-(--section-color) px-4 py-8";
const ruleSectionClass = "bg-(--background-color) py-16 text-white";

const RuleSection = ({ children }: { children: ReactNode }) => (
  <section className={ruleSectionClass}>
    <div className="mx-auto w-full max-w-2xl px-4">{children}</div>
  </section>
);

const RuleSectionHeading = ({
  id,
  children,
  className = sectionClass,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) => (
  <h2 id={id} className={className}>
    {children}
  </h2>
);

const RuleSubSection = ({ children }: { children: ReactNode }) => (
  <div className={ruleSubSectionClass}>{children}</div>
);

const RuleSubHeading = ({ children }: { children: ReactNode }) => (
  <h3 className={subSectionClass}>{children}</h3>
);

const wildcardRulesTableData: (string | ReactNode)[][] = [
  [m.rule_col_category(), m.rule_col_deadline_rule()],
  [
    m.rule_all_categories(),
    <>
      {m.rule_penalty_overtime()}
      <br />
      {m.rule_submission_start()} 1/21
    </>,
  ],
  [
    "Solo",
    <>
      {m.rule_time_limit()} 2:10
      <br />
      {m.rule_submission_deadline()} 3/9 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 3/31 {m.rule_time_undecided()}
    </>,
  ],
  [
    "Tag Team",
    <>
      {m.rule_time_limit()} 2:10
      <br />
      {m.rule_submission_deadline()} 3/23 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 4/12 {m.rule_time_undecided()}
    </>,
  ],
  [
    "Loopstation",
    <>
      {m.rule_time_limit()} 3:30
      <br />
      {m.rule_submission_deadline()} 3/9 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 3/30 {m.rule_time_undecided()}
      <br />
      {m.rule_rc505_only({ RC505 })}
      <br />
      {m.rule_partial_exceptions()}
    </>,
  ],
  [
    "Producer",
    <>
      {m.rule_time_limit()} 5:00
      <br />
      {m.rule_submission_deadline()} 3/23 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 4/13 {m.rule_time_undecided()}
      <br />
      {m.rule_no_device_limit()}
    </>,
  ],
  [
    "Crew",
    <>
      {m.rule_time_limit()} 3:10
      <br />
      {m.rule_submission_deadline()} 3/23 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 4/14 {m.rule_time_undecided()}
    </>,
  ],
];

const mainJudgesTableData: string[][] = [
  [m.rule_col_category(), m.rule_col_judges()],
  ["Solo", "FOOTBOXG\nCOLAPS\nDHARNI\nHISS\nNAPOM"],
  ["Tag Team", "CHRIS CELIZ\nFOOTBOXG\nFROSTY\nHIRONA\nRIVER'"],
  ["Loopstation", "BIZKIT\nROBIN\nFROSTY\nSLIZZER\nTIONEB"],
  ["Producer", "JAYTON\nROBIN\nFROSTY\nPASH\nTIONEB"],
  ["Crew", "CHRIS CELIZ\nCOLAPS\nDHARNI\nSLIZZER\nSO-SO"],
  ["7toSmoke", `${m.rule_judges_unknown()}\n${m.rule_judges_not_announced()}`],
];

const wildcardJudgesTableData: string[][] = [
  [m.rule_col_category(), m.rule_col_judges()],
  ["Solo", "FOOTBOXG\nCOLAPS\nRIVER'"],
  ["Tag Team", "RIVER'\nCOLAPS\nCHRIS CELIZ"],
  ["Loopstation", "BIZKIT\nKRISTOF\nTIONEB"],
  ["Producer", "INKIE\nKRISTOF\nTIONEB"],
  ["Crew", "CHRIS CELIZ\nCOLAPS\nSLIZZER"],
];

export const RuleContent = ({ locale, year, seedData }: RuleContentProps) => {
  const participantsPath = `/${locale}/${year}/participants`;
  const teamHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const teamLabel = locale === "ko" ? m.team_korea() : m.team_japan();

  return (
    <main className="bg-(--background-color) pt-16">
      <RuleSection>
        <p className={paragraphClass}>
          {m.rule_intro({
            year: String(year),
            Wildcard: WILDCARD,
            Swissbeatbox: SWISSBEATBOX,
          })}
          <br />
          {m.rule_source_site()}：
          <a
            href={SWISSBEATBOX_SOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            GBB {year} Wildcard Competition Rules and Application
          </a>
        </p>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.how_to_plan()}
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard
            text={m.wildcard_list({ Wildcard: WILDCARD })}
            href={`/${locale}/${year}/wildcards`}
          />
        </div>

        <RuleSectionHeading id="toc-section" className={tocSectionClass}>
          {m.rule_toc()}
        </RuleSectionHeading>
        <ol className="mb-8 list-decimal space-y-2 pl-8">
          <li>
            <a href="#notices-section" className={anchorClass}>
              {m.rule_toc_notices()}
            </a>
          </li>
          <li>
            <a href="#category-section" className={anchorClass}>
              {m.rule_toc_categories()}
            </a>
          </li>
          <li>
            <a href="#seeds-section" className={anchorClass}>
              {m.rule_seeds_title_alt()}
            </a>
          </li>
          <li>
            <a href="#wildcard-rules-section" className={anchorClass}>
              {m.rule_wildcard_deadline_title({ Wildcard: WILDCARD })}
            </a>
          </li>
          <li>
            <a href="#main-judges-section" className={anchorClass}>
              GBB {year} {m.rule_main_judges()}
            </a>
          </li>
          <li>
            <a href="#wildcard-judges-section" className={anchorClass}>
              {m.rule_wildcard_judges({ Wildcard: WILDCARD })}
            </a>
          </li>
        </ol>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="notices-section">
          {m.rule_toc_notices()}
        </RuleSectionHeading>
        <p className={paragraphClass}>
          {m.rule_notices_p1({ Beatbox: "Beatbox" })}
          <br />
          {m.rule_notices_p1_note()}
          <strong>{m.rule_notices_p1_strong()}</strong>
        </p>
        <p className={paragraphClass}>
          {m.rule_notices_p2()}
          <br />
          {m.rule_notices_p2_prefix({ Wildcard: WILDCARD })}
          <strong className="text-red-500">{m.rule_notices_p2_strong()}</strong>
        </p>
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.how_to_plan()}
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard
            text={
              <span>
                {m.wildcard_result({ Wildcard: WILDCARD })}
                <br />
                {m.participants()}
              </span>
            }
            href={participantsPath}
          />
        </div>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="category-section">
          {m.rule_toc_categories()}
        </RuleSectionHeading>
        <Table
          data={[
            [m.rule_col_category(), WILDCARD, m.rule_col_seed(), m.rule_col_total()],
            ["Solo", "8", "8", "16"],
            ["Loopstation", "6", "2", "8"],
            ["Crew", "3", "1", "4"],
            ["Producer", "3", "1", "4"],
            ["Tag Team", "6", "1", "7"],
          ]}
          textCenter
        />
        <p className={paragraphClass}>{m.rule_category_note()}</p>
        <p className={paragraphClass}>
          {m.rule_forgotten_ttl({ TagTeamLoopstation: "Tag Team Loopstation" })}
          😭
        </p>

        <RuleSubSection>
          <RuleSubHeading>{m.rule_producer_title({ Producer: PRODUCER })}</RuleSubHeading>
          <p className={paragraphClass}>
            {m.rule_producer_description({
              Loopstation: LOOPSTATION,
              Producer: PRODUCER,
            })}
          </p>
        </RuleSubSection>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="seeds-section">
          {m.rule_seeds_title_alt()}
        </RuleSectionHeading>
        <p className={paragraphClass}>
          {m.rule_seeds_intro_alt({ Wildcard: WILDCARD })}
        </p>

        <RuleSubSection>
          <RuleSubHeading>{m.rule_seeds_section_gbb()}</RuleSubHeading>
          <RuleSeedTable participants={seedData.gbbSeed} locale={locale} />
        </RuleSubSection>

        <RuleSubSection>
          <RuleSubHeading>{m.rule_seeds_section_other()}</RuleSubHeading>
          <RuleSeedTable participants={seedData.otherSeed} locale={locale} />
        </RuleSubSection>

        <RuleSubSection>
          <RuleSubHeading>{m.rule_seeds_cancelled_title()}</RuleSubHeading>
          <RuleSeedTable participants={seedData.cancelled} cancelled locale={locale} />
        </RuleSubSection>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.wildcard_result({ Wildcard: WILDCARD })}
            href={participantsPath}
          />
          <LinkCard
            text={m.rule_participants_list()}
            href={participantsPath}
          />
        </div>

        <p className={paragraphClass}>
          {m.rule_replacement_intro({ Wildcard: WILDCARD })}
        </p>
        <PostIt>
          <p className="mb-4">
            <strong>{m.rule_seeds_tournament_note()}</strong>
            <br />
            {m.rule_seeds_tournament_rule()}
          </p>
          <p>{m.rule_seeds_tournament_example({ Wildcard: WILDCARD })}</p>
        </PostIt>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.how_to_plan()}
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard text={teamLabel} href={teamHref} />
        </div>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="wildcard-rules-section">
          {m.rule_wildcard_deadline_title({ Wildcard: WILDCARD })}
        </RuleSectionHeading>
        <Table data={wildcardRulesTableData} textCenter />
        <PostIt>
          <p>
            {m.rule_dst_note({ year: String(year) })}
            <br />
            {m.rule_dst_tag_team_crew_note({ TagTeam: TAG_TEAM, Crew: CREW })}
          </p>
        </PostIt>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.how_to_plan()}
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard
            text={m.wildcard_stream({ Wildcard: WILDCARD })}
            href={`/${locale}/others/result_stream`}
          />
        </div>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="main-judges-section">
          {m.rule_main_judges()}
        </RuleSectionHeading>
        <p className="mb-8 text-center">
          <a href="#wildcard-judges-section" className={anchorClass}>
            {m.rule_wildcard_judges_link({ Wildcard: WILDCARD })}
          </a>
        </p>
        <Table data={mainJudgesTableData} textCenter />
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.how_to_plan()}
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard
            text={
              <span>
                {m.wildcard_result({ Wildcard: WILDCARD })}
                <br />
                {m.participants()}
              </span>
            }
            href={participantsPath}
          />
        </div>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="wildcard-judges-section">
          {m.rule_wildcard_judges({ Wildcard: WILDCARD })}
        </RuleSectionHeading>
        <Table data={wildcardJudgesTableData} textCenter />
        <p className="mb-8 mt-8 text-center">
          <a href="#main-judges-section" className={anchorClass}>
            {m.rule_main_judges_link({ year: String(year) })}
          </a>
        </p>
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.how_to_plan()}
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard
            text={m.wildcard_list({ Wildcard: WILDCARD })}
            href={`/${locale}/${year}/wildcards`}
          />
        </div>
      </RuleSection>
    </main>
  );
};
