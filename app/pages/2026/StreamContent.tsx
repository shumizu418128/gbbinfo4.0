import type { SupportedLanguage } from "~/constants/languageLabels.js";
import * as m from "../../../paraglide/messages.js";

type StreamContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const anchorClass =
  "inline-block rounded bg-(--gbb-color) px-4 py-2 text-sm font-bold text-white transition-opacity duration-150 hover:opacity-80";

export const StreamContent = ({ locale, year }: StreamContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">

        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold">{m.wildcard_stream({ Wildcard: "Wildcard" })}</h2>
          <div className="text-center text-xl text-(--secondary-text-color) py-16">
            coming soon...
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold">{m.livestream()}</h2>
          <div className="text-center text-xl text-(--secondary-text-color) py-16">
            coming soon...
          </div>
        </section>

      </div>
    </main>
  );
};
