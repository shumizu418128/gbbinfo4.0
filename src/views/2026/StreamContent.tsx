import type { SupportedLanguage } from "~/constants/languageLabels.js";
import * as m from "../../../paraglide/messages.js";

type StreamContentProps = {
  locale: SupportedLanguage;
  year: number;
};

export const StreamContent = ({ locale, year }: StreamContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">

        <div className="text-center text-xl text-(--secondary-text-color) py-16">
          coming soon...
        </div>

      </div>
    </main>
  );
};
