import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { Table } from "~/components/Table.js";
import * as m from "../../../paraglide/messages.js";

type TimetableContentProps = {
  locale: SupportedLanguage;
  year: number;
};

type DaySection = {
  id: string;
  scrollKey?: string;
  label: string;
};

const DAYS: DaySection[] = [
  { id: "day1", label: "Day1 - 9/24" },
  { id: "day2", label: "Day2 - 9/25" },
  { id: "day3", label: "Day3 - 9/26" },
  { id: "seven-to-smoke", scrollKey: "7tosmoke", label: "7toSmoke - 9/27" },
];

const sectionClass = "mb-4 text-xl font-bold scroll-mt-16";
const paragraphClass = "mb-4 leading-relaxed text-(--secondary-text-color)";
const anchorClass =
  "inline-block rounded bg-(--gbb-color) px-4 py-2 text-sm font-bold text-white transition-opacity duration-150 hover:opacity-80";

export const TimetableContent = ({ locale, year }: TimetableContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">

        <p className={paragraphClass}>{m.timetable_note_schedule()}</p>
        <p className={paragraphClass}>{m.timetable_note_delay()}</p>
        <p className={paragraphClass}>{m.timetable_note_past()}</p>

        <div className="mb-4 text-3xl font-bold">Coming soon...</div>

      </div>
    </main>
  );
};
