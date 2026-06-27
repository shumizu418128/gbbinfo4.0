import type { SupportedLanguage } from "~/constants/languageLabels.js";
import * as m from "../../../paraglide/messages.js";

type TranslationContentProps = {
  locale: SupportedLanguage;
};

const paragraphClass = "mb-4 leading-relaxed";
const listClass = "mb-4 list-disc pl-8 space-y-2";

export const TranslationContent = ({ locale: _locale }: TranslationContentProps) => {
  const WILDCARD = "Wildcard";

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <h1 className="mb-8 text-2xl font-bold">{m.others_translation_title()}</h1>
        <p className={paragraphClass}>{m.others_translation_gemini()}</p>
        <p className={paragraphClass}>{m.others_translation_ai_disclaimer()}</p>
        <p className={paragraphClass}>{m.others_translation_pages_intro()}</p>

        <ul className={listClass}>
          <li>
            {m.others_translation_year_range()}
            <ul className="mt-2 list-disc pl-8 space-y-2">
              <li>
                {m.wildcard_result({ Wildcard: WILDCARD })} & {m.participants()}
              </li>
              <li>
                {m.rules()} & {m.judges()}
              </li>
              <li>{m.time_table()}</li>
              <li>{m.team_japan()}</li>
              <li>{m.venue_tickets()}</li>
              <li>{m.livestream()}</li>
              <li>{m.result()}</li>
              <li>{m.wildcard_list({ Wildcard: WILDCARD })}</li>
            </ul>
          </li>
        </ul>

        <p className={paragraphClass}>{m.others_translation_lang_note()}</p>
        <p className={paragraphClass}>{m.others_translation_untranslated_note()}</p>
      </div>
    </main>
  );
};
