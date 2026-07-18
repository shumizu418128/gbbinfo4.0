import { JapaneseOnlyPageNotice } from "~/components/JapaneseOnlyPageNotice.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import * as m from "../../../paraglide/messages.js";

type TranslationContentProps = {
  locale: SupportedLanguage;
};

const paragraphClass = "mb-4 leading-relaxed";

export const TranslationContent = ({ locale: _locale }: TranslationContentProps) => {

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <JapaneseOnlyPageNotice />
        <p className={paragraphClass}>{m.others_translation_gemini()}</p>
        <p className={paragraphClass}>{m.others_translation_ai_disclaimer()}</p>
        <p className={paragraphClass}>{m.others_translation_lang_note()}</p>
        <p className={paragraphClass}>{m.others_translation_untranslated_note()}</p>
      </div>
    </main>
  );
};
