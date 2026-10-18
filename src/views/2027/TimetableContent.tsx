import type { SupportedLanguage } from "~/constants/languageLabels.js";
import * as m from "../../../paraglide/messages.js";

type TimetableContentProps = {
  locale: SupportedLanguage;
  year: number;
};

export const TimetableContent = (_props: TimetableContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className="py-40 text-center text-2xl text-(--secondary-text-color)">
          {m.rule_update_pending()}
        </p>
      </div>
    </main>
  );
};
