import type { ReactNode } from "react";
import { LinkCard } from "~/components/LinkCard.js";
import { Table } from "~/components/Table.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { LOOPSTATION, SOLO, WILDCARD } from "~/constants/i18nTerms.js";
import { anchorClass } from "~/constants/linkStyle.js";
import * as m from "../../../paraglide/messages.js";

const YEAR = 2020;

type RuleContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const sectionClass = "mb-4 text-2xl font-bold";
const paragraphClass = "mb-4 leading-relaxed";
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

const finalJudgesTableData: string[][] = [
  [m.rule_col_category(), m.rule_col_judges()],
  [SOLO, "CHRIS CELIZ\nDHARNI\nK.I.M\nREEPS ONE\nSKILLER"],
  [LOOPSTATION, "BEATNESS\nGENE SHINOZAKI\nMB14\nTOM THUM\nZEDE"],
];

const qualifierJudgesTableData: string[][] = [
  [m.rule_col_category(), m.rule_col_judges()],
  [SOLO, "AMIT\nCHEZAME\nCOLAPS\nTIMMEH\nTHOMSON"],
  [LOOPSTATION, "BEATNESS\nMIXFX\nMB14\nTOM THUM\nZEDE"],
];

export const RuleContent = ({ locale, year }: RuleContentProps) => {
  return (
    <main className="bg-(--background-color) pt-16">
      <RuleSection>
        <p className={paragraphClass}>{m.rule_online_intro({ year: String(year) })}</p>

        <RuleSectionHeading id="toc-section">{m.rule_toc()}</RuleSectionHeading>
        <ol className="mb-8 list-decimal space-y-2 pl-8">
          <li>
            <a href="#background-section" className={anchorClass}>
              {m.rule_cancellation_background_title()}
            </a>
          </li>
          <li>
            <a href="#category-section" className={anchorClass}>
              {m.rule_toc_categories()}
            </a>
          </li>
          <li>
            <a href="#final-judges-section" className={anchorClass}>
              GBB {year} {m.rule_main_judges()}
            </a>
          </li>
          <li>
            <a href="#qualifier-judges-section" className={anchorClass}>
              {m.rule_wildcard_judges({ Wildcard: WILDCARD })}
            </a>
          </li>
        </ol>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="background-section">
          {m.rule_cancellation_background_title()}
        </RuleSectionHeading>
        <p className={paragraphClass}>{m.rule_cancellation_background({ Solo: SOLO, Loopstation: LOOPSTATION })}</p>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="category-section">{m.rule_toc_categories()}</RuleSectionHeading>
        <Table
          data={[
            [m.rule_col_category(), m.rule_category_invitees()],
            [
              SOLO,
              m.rule_solo_invitees_list({ Wildcard: WILDCARD }),
            ],
            [LOOPSTATION, m.rule_loop_invitees_list({ Wildcard: WILDCARD })],
          ]}
          textCenter
        />
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard text={m.how_to_plan()} href={`/${locale}/others/how_to_plan`} />
          <LinkCard text={m.gbb_year_guide({ year: String(YEAR) })} href={`/${locale}/${year}/top`} />
        </div>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="final-judges-section">
          {m.rule_final_tournament_judges()}
        </RuleSectionHeading>
        <Table data={finalJudgesTableData} textCenter />
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="qualifier-judges-section">
          {m.rule_qualifier_judges()}
        </RuleSectionHeading>
        <Table data={qualifierJudgesTableData} textCenter />
      </RuleSection>
    </main>
  );
};
