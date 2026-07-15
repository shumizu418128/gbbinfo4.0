import type { ReactNode } from "react";
import { LinkCard } from "~/components/LinkCard.js";
import { RuleSeedTable } from "~/components/RuleSeedTable.js";
import { Table } from "~/components/Table.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import {
  GBB,
  CREW,
  LOOPSTATION,
  SOLO,
  SWISSBEATBOX,
  TAG_TEAM,
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
  [SOLO, "D-LOW\nKENNY URBAN\nZEDE\nREEPS ONE\nPE4ENKATA"],
  [TAG_TEAM, "D-LOW\nKENNY URBAN\nCHRIS CELIZ\nBEATNESS\nBMG"],
  [LOOPSTATION, "INKIE\nTHE PETEBOX\nZEDE\nBEATNESS\nSARO"],
  [TAG_TEAM_LOOPSTATION, "INKIE\nTHE PETEBOX\nZEDE\nGENE SHINOZAKI\nSARO"],
  [CREW, "MC ZANI\nKENNY URBAN\nCHRIS CELIZ\nBEATNESS\nBEASTY"],
];

const wildcardJudges2020TableData: string[][] = [
  [m.rule_col_category(), m.rule_col_judges()],
  [SOLO, "PEPOUNI\nSINJO\nMADOX\nCIACCOLO\nKIM\nSKILLER\nZEDE"],
  [TAG_TEAM, "PEPOUNI\nSINJO\nMADOX\nCIACCOLO\nCHRIS CELIZ\nBMG\nNAPOM"],
  [LOOPSTATION, "PEPOUNI\nSINJO\nMADOX\nCIACCOLO\nTIONEB\nINKIE\nGENE SHINOZAKI"],
  [
    TAG_TEAM_LOOPSTATION,
    "PEPOUNI\nSINJO\nMADOX\nCIACCOLO\nTOM THUM\nGENE SHINOZAKI\nFAYA BRAZ",
  ],
  [CREW, "PEPOUNI\nSINJO\nMADOX\nCIACCOLO\nMC ZANI\nTOM THUM\nHOBBIT"],
];

export const RuleContent = ({ locale, year, seedData }: RuleContentProps) => {
  const participantsPath = `/${locale}/${year}/participants`;
  const teamHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const teamLabel = locale === "ko" ? m.team_korea() : m.team_japan();

  const wildcardJudges2021TableData: (string | ReactNode)[][] = [
    [m.rule_col_category(), m.rule_col_judges()],
    [SOLO, "KENNY URBAN\nPE4ENKATA\nSKILLER\nKIM\nBALL-ZEE"],
    [TAG_TEAM, "KENNY URBAN\nCHRIS CELIZ\nMC ZANI\nHOBBIT\nZHANG ZE"],
    [LOOPSTATION, "TIONEB\nINKIE\nSARO\nHOBBIT\nPE4ENKATA"],
    [TAG_TEAM_LOOPSTATION, m.rule_extra_slot_none()],
    [CREW, "KENNY URBAN\nCHRIS CELIZ\nMC ZANI\nHOBBIT\nZHANG ZE"],
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
            {GBB} 2021 {WILDCARD} Competition
          </a>
          <br />
          <a
            href={SWISSBEATBOX_SOURCE_2020}
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            {GBB} 2020 {WILDCARD} Competition
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
              {m.rule_supplementary_notes()}
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
              {m.rule_judges_prior_wildcard({ Wildcard: WILDCARD })}
            </a>
          </li>
          <li>
            <a href="#wildcard-judges-2021-section" className={anchorClass}>
              {m.rule_judges_extra_wildcard({ Wildcard: WILDCARD })}
            </a>
          </li>
        </ol>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="notices-section">
          {m.rule_supplementary_notes()}
        </RuleSectionHeading>
        <p className={paragraphClass}>{m.rule_postponement_note_p1()}</p>
        <p className={paragraphClass}>{m.rule_postponement_note_p2()}</p>
        <p className={paragraphClass}>{m.rule_postponement_note_p3()}</p>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="category-section">
          {m.rule_toc_categories()}
        </RuleSectionHeading>
        <p className={paragraphClass}>{m.rule_category_routes_intro()}</p>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>{m.rule_route_cancelled_wildcard({ Wildcard: WILDCARD })}</li>
          <li>{m.rule_route_cancelled_seed()}</li>
          <li>{m.rule_route_online_winner()}</li>
          <li>{m.rule_route_extra_wildcard({ Wildcard: WILDCARD })}</li>
        </ul>
        <Table
          data={[
            [
              m.rule_col_category(),
              WILDCARD,
              m.rule_col_seed(),
              m.rule_col_total(),
            ],
            [SOLO, "16", "8", "24"],
            [TAG_TEAM, "9", "1", "10"],
            [LOOPSTATION, "14", "3", "17"],
            [TAG_TEAM_LOOPSTATION, "3", "0", "3"],
            [CREW, "4", "0", "4"],
          ]}
          textCenter
        />
        <p className={paragraphClass}>
          {m.rule_debut_category_no_seed({
            TagTeamLoopstation: TAG_TEAM_LOOPSTATION,
            Crew: CREW,
          })}
        </p>
        <p className={paragraphClass}>
          {m.rule_slot_count_merged({
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
          {m.rule_seed_forfeit_policy({ Wildcard: WILDCARD })}
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
          {m.rule_judges_prior_wildcard({ Wildcard: WILDCARD })}
        </RuleSectionHeading>
        <Table data={wildcardJudges2020TableData} textCenter />
        <p className={`${paragraphClass} mt-8`}>{m.rule_sbx_judges_historical_note()}</p>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="wildcard-judges-2021-section">
          {m.rule_judges_extra_wildcard({ Wildcard: WILDCARD })}
        </RuleSectionHeading>
        <Table data={wildcardJudges2021TableData} textCenter />
      </RuleSection>
    </main>
  );
};
