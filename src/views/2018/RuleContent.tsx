import type { ReactNode } from "react";
import { LinkCard } from "~/components/LinkCard.js";
import { PostIt } from "~/components/PostIt.js";
import { RuleSeedTable } from "~/components/RuleSeedTable.js";
import { Table } from "~/components/Table.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { BEATBOX, LOOPSTATION, SEVEN_TO_SMOKE, SOLO, TAG_TEAM, WILDCARD } from "~/constants/i18nTerms.js";
import { anchorClass } from "~/constants/linkStyle.js";
import type { ParticipantWithRelations } from "~/db/participant.js";
import * as m from "../../../paraglide/messages.js";

const YEAR = 2018;

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

const sectionClass = "mb-4 text-2xl font-bold";
const paragraphClass = "mb-4 leading-relaxed";
const subSectionClass = "mb-4 font-bold";
const ruleSubSectionClass = "mt-8 bg-(--section-color) px-4 py-8";
const ruleSectionClass = "bg-(--background-color) py-24 text-white";

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
  [m.rule_col_category(), m.judges()],
  [SOLO, "ALEXINHO\nKRNFX\nKENNY URBAN\nNAPOM\nZHANG ZE"],
  [TAG_TEAM, "ALEXINHO\nJAYTON\nPASH\nSARO\nTHORSEN"],
  [LOOPSTATION, "ALEXINHO\nKRNFX\nSARO\nZEDE\nTHORSEN"],
  [SEVEN_TO_SMOKE, "BEATNESS\nCHRIS CELIZ\nSHOW-GO\nGHITZMO"],
];

export const RuleContent = ({ locale, year, seedData }: RuleContentProps) => {
  const participantsPath = `/${locale}/${year}/participants`;

  return (
    <main className="bg-(--background-color) pt-16">
      <RuleSection>
        <p className={paragraphClass}>
          {m.rule_intro_closed_site({ year: String(year), Wildcard: WILDCARD })}
        </p>

        <RuleSectionHeading id="toc-section">{m.rule_toc()}</RuleSectionHeading>
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
            <a href="#main-judges-section" className={anchorClass}>
              GBB {year} {m.rule_main_judges()}
            </a>
          </li>
        </ol>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="notices-section">{m.rule_toc_notices()}</RuleSectionHeading>
        <p className={paragraphClass}>
          {m.rule_notices_p1({ Beatbox: BEATBOX })}
          <br />
          {m.rule_closed_site_note()}
        </p>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="category-section">{m.rule_toc_categories()}</RuleSectionHeading>
        <Table
          data={[
            [m.rule_col_category(), WILDCARD, m.rule_col_seed(), m.rule_col_total()],
            [SOLO, "10", "5", "15"],
            [TAG_TEAM, "3", "6", "9"],
            [LOOPSTATION, "6", "2", "8"],
          ]}
          textCenter
        />
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="seeds-section">{m.rule_seeds_title_alt()}</RuleSectionHeading>
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
          <LinkCard text={m.participants_list()} href={participantsPath} />
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
          <LinkCard text={m.how_to_plan()} href={`/${locale}/others/how_to_plan`} />
          <LinkCard text={m.back_to_home()} href={`/${locale}/${year}/top`} />
        </div>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="main-judges-section">{m.rule_main_judges()}</RuleSectionHeading>
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
    </main>
  );
};
