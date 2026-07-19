import type { SupportedLanguage } from "~/constants/languageLabels.js";
import {
  LOOPSTATION,
  SHOWCASE,
  SOLO,
  SWISSBEATBOX,
  WILDCARD,
} from "~/constants/i18nTerms.js";
import { anchorClass } from "~/constants/linkStyle.js";
import * as m from "../../../paraglide/messages.js";

type StudioCompetitionContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const paragraphClass = "mb-4 leading-relaxed";
const sectionClass = "mb-8 text-2xl font-bold";

export const StudioCompetitionContent = ({ locale, year }: StudioCompetitionContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">

        <section className="mb-16">
          <h2 className={sectionClass}>{m.rule_showcase_title({ SHOWCASE })}</h2>
          <p className={paragraphClass}>
            {m.rule_showcase_p1({ SHOWCASE })}
          </p>
          <p className={paragraphClass}>
            {m.rule_showcase_p1_battle()}
          </p>
          <p className={paragraphClass}>
            {m.rule_showcase_p1_review({ Wildcard: WILDCARD })}
          </p>
          <p className={paragraphClass}>
            {m.rule_showcase_p2({ SHOWCASE, Solo: SOLO, Loopstation: LOOPSTATION, Swissbeatbox: SWISSBEATBOX })}
          </p>
        </section>

        <section className="mb-16">
          <h2 className={sectionClass}>{m.rule_eligibility_condition()}</h2>
          <p className={paragraphClass}>
            {m.rule_showcase_eligibility_intro()}
          </p>
          <ul className="mb-4 list-disc pl-8 space-y-2">
            <li>{m.rule_eligibility_past_gbb()}</li>
            <li>{m.rule_eligibility_pro()}</li>
            <li>{m.rule_eligibility_pro_show()}</li>
            <li>{m.rule_eligibility_pro_performed()}</li>
          </ul>
          <p className={paragraphClass}>
            {m.rule_showcase_age_limit({ year })}
          </p>
          <p className={paragraphClass}>
            {m.rule_showcase_cannot_apply({ year })}
          </p>
        </section>

        <section className="mb-16">
          <h2 className={sectionClass}>{m.rule_submission_deadline()}</h2>
          <p className={paragraphClass}>
            {m.rule_showcase_loop_recording()}
          </p>
          <div className="mb-4">
            <a
              href="https://swissbeatbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              {m.rule_showcase_source({ SHOWCASE, Wildcard: WILDCARD })}
            </a>
          </div>
        </section>

      </div>
    </main>
  );
};
