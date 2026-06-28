import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { Table } from "~/components/Table.js";
import * as m from "../../../paraglide/messages.js";

type TimetableContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const paragraphClass = "mb-4 leading-relaxed text-(--secondary-text-color)";

export const TimetableContent = ({ locale, year }: TimetableContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">

        <p className={paragraphClass}>{m.timetable_note_schedule()}</p>
        <p className={paragraphClass}>{m.timetable_note_delay()}</p>
        <p className={paragraphClass}>{m.timetable_note_past()}</p>

        <div className="mt-32 mb-4 text-3xl font-bold">Coming soon...</div>

      </div>
    </main>
  );
};
