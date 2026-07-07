import type { ReactNode } from "react";
import { LinkCard } from "~/components/LinkCard.js";
import { RuleSeedTable } from "~/components/RuleSeedTable.js";
import { Table } from "~/components/Table.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import {
  CREW,
  SWISSBEATBOX,
  TAG_TEAM_LOOPSTATION,
  WILDCARD,
} from "~/constants/i18nTerms.js";
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

const SWISSBEATBOX_SOURCE_2021 =
  "https://swissbeatbox.com/newsfeed/grand-beatbox-battle-2021-wildcard-competition/";
const SWISSBEATBOX_SOURCE_2020 =
  "https://swissbeatbox.com/newsfeed/gbb-20-wildcard-competition/comment-page-5/";

const sectionClass = "mb-4 text-2xl font-bold";
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
}: {
  id: string;
  children: ReactNode;
}) => (
  <h2 id={id} className={sectionClass}>
    {children}
  </h2>
);

const RuleSubSection = ({ children }: { children: ReactNode }) => (
  <div className={ruleSubSectionClass}>{children}</div>
);

const RuleSubHeading = ({ children }: { children: ReactNode }) => (
  <h3 className={subSectionClass}>{children}</h3>
);

const mainJudgesTableData: string[][] = [
  [m.rule_col_category(), m.rule_col_judges()],
  ["Solo", "D-LOW\nKENNY URBAN\nZEDE\nREEPS ONE\nPE4ENKATA"],
  ["Tag Team", "D-LOW\nKENNY URBAN\nCHRIS CELIZ\nBEATNESS\nBMG"],
  ["Loopstation", "INKIE\nTHE PETEBOX\nZEDE\nBEATNESS\nSARO"],
  ["Tag Team Loopstation", "INKIE\nTHE PETEBOX\nZEDE\nGENE SHINOZAKI\nSARO"],
  ["Crew", "MC ZANI\nKENNY URBAN\nCHRIS CELIZ\nBEATNESS\nBEASTY"],
];

const wildcardJudges2020TableData: string[][] = [
  [m.rule_col_category(), m.rule_col_judges()],
  ["Solo", "PEPOUNI\nSINJO\nMADOX\nCIACCOLO\nKIM\nSKILLER\nZEDE"],
  ["Tag Team", "PEPOUNI\nSINJO\nMADOX\nCIACCOLO\nCHRIS CELIZ\nBMG\nNAPOM"],
  ["Loopstation", "PEPOUNI\nSINJO\nMADOX\nCIACCOLO\nTIONEB\nINKIE\nGENE SHINOZAKI"],
  [
    "Tag Team Loopstation",
    "PEPOUNI\nSINJO\nMADOX\nCIACCOLO\nTOM THUM\nGENE SHINOZAKI\nFAYA BRAZ",
  ],
  ["Crew", "PEPOUNI\nSINJO\nMADOX\nCIACCOLO\nMC ZANI\nTOM THUM\nHOBBIT"],
];

export const RuleContent = ({ locale, year, seedData }: RuleContentProps) => {
  const participantsPath = `/${locale}/${year}/participants`;
  const teamHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const teamLabel = locale === "ko" ? m.team_korea() : m.team_japan();

  const wildcardJudges2021TableData: (string | ReactNode)[][] = [
    [m.rule_col_category(), m.rule_col_judges()],
    ["Solo", "KENNY URBAN\nPE4ENKATA\nSKILLER\nKIM\nBALL-ZEE"],
    ["Tag Team", "KENNY URBAN\nCHRIS CELIZ\nMC ZANI\nHOBBIT\nZHANG ZE"],
    ["Loopstation", "TIONEB\nINKIE\nSARO\nHOBBIT\nPE4ENKATA"],
    ["Tag Team Loopstation", m.rule2021_extra_none()],
    ["Crew", "KENNY URBAN\nCHRIS CELIZ\nMC ZANI\nHOBBIT\nZHANG ZE"],
  ];

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
          <br />
          <a
            href={SWISSBEATBOX_SOURCE_2021}
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            GBB 2021 Wildcard Competition
          </a>
          <br />
          <a
            href={SWISSBEATBOX_SOURCE_2020}
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            GBB 2020 Wildcard Competition
          </a>
        </p>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard text={m.how_to_plan()} href={`/${locale}/others/how_to_plan`} />
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

        <RuleSectionHeading id="toc-section">{m.rule_toc()}</RuleSectionHeading>
        <ol className="mb-8 list-decimal space-y-2 pl-8">
          <li>
            <a href="#notices-section" className={anchorClass}>
              {m.rule2021_toc_notices()}
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
            <a href="#main-judges-section" className={anchorClass}>
              GBB {year} {m.rule_main_judges()}
            </a>
          </li>
          <li>
            <a href="#wildcard-judges-2020-section" className={anchorClass}>
              {m.rule2021_judges_2020wc({ Wildcard: WILDCARD })}
            </a>
          </li>
          <li>
            <a href="#wildcard-judges-2021-section" className={anchorClass}>
              {m.rule2021_judges_2021extra({ Wildcard: WILDCARD })}
            </a>
          </li>
        </ol>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="notices-section">
          {m.rule2021_toc_notices()}
        </RuleSectionHeading>
        <p className={paragraphClass}>{m.rule2021_notes_p1()}</p>
        <p className={paragraphClass}>{m.rule2021_notes_p2()}</p>
        <p className={paragraphClass}>{m.rule2021_notes_p3()}</p>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="category-section">
          {m.rule_toc_categories()}
        </RuleSectionHeading>
        <p className={paragraphClass}>{m.rule2021_categories_intro()}</p>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>{m.rule2021_route_2020_wildcard({ Wildcard: WILDCARD })}</li>
          <li>{m.rule2021_route_2020_seed()}</li>
          <li>{m.rule2021_route_2020online()}</li>
          <li>{m.rule2021_route_2021extra({ Wildcard: WILDCARD })}</li>
        </ul>
        <Table
          data={[
            [
              m.rule_col_category(),
              WILDCARD,
              m.rule_col_seed(),
              m.rule_col_total(),
            ],
            ["Solo", "16", "8", "24"],
            ["Tag Team", "9", "1", "10"],
            ["Loopstation", "14", "3", "17"],
            ["Tag Team Loopstation", "3", "0", "3"],
            ["Crew", "4", "0", "4"],
          ]}
          textCenter
        />
        <p className={paragraphClass}>
          {m.rule2021_category_note1({
            TagTeamLoopstation: TAG_TEAM_LOOPSTATION,
            Crew: CREW,
          })}
        </p>
        <p className={paragraphClass}>
          {m.rule2021_category_note2({
            TagTeamLoopstation: TAG_TEAM_LOOPSTATION,
          })}
        </p>
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
          <RuleSeedTable
            participants={seedData.cancelled}
            cancelled
            locale={locale}
          />
        </RuleSubSection>

        <p className={`${paragraphClass} mt-8`}>
          {m.rule2021_seed_forfeit({ Wildcard: WILDCARD })}
        </p>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard text={m.how_to_plan()} href={`/${locale}/others/how_to_plan`} />
          <LinkCard text={teamLabel} href={teamHref} />
        </div>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="main-judges-section">
          GBB {year} {m.rule_main_judges()}
        </RuleSectionHeading>
        <Table data={mainJudgesTableData} textCenter />
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard text={m.how_to_plan()} href={`/${locale}/others/how_to_plan`} />
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
        <RuleSectionHeading id="wildcard-judges-2020-section">
          {m.rule2021_judges_2020wc({ Wildcard: WILDCARD })}
        </RuleSectionHeading>
        <Table data={wildcardJudges2020TableData} textCenter />
        <p className={`${paragraphClass} mt-8`}>{m.rule2021_2020_judges_note()}</p>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="wildcard-judges-2021-section">
          {m.rule2021_judges_2021extra({ Wildcard: WILDCARD })}
        </RuleSectionHeading>
        <Table data={wildcardJudges2021TableData} textCenter />
      </RuleSection>
    </main>
  );
};
