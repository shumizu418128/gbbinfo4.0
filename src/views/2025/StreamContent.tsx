import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { LinkCard } from "~/components/LinkCard.js";
import * as m from "../../../paraglide/messages.js";

type StreamContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const STREAM_LINKS = [
  { label: "Day1 10/31", href: "https://www.youtube.com/watch?v=kCJvevrV4aA" },
  { label: "Day2 11/1", href: "https://www.youtube.com/watch?v=IXLgPzCCXUQ" },
  { label: "Day3 11/2", href: "https://www.youtube.com/watch?v=zeAZyT5y7do" },
  {
    label: "7toSmoke 11/3",
    href: "https://abema.tv/live-event/1d1538de-2d88-4c50-99ac-bd58bec96e0a",
  },
] as const;

export const StreamContent = ({ locale, year }: StreamContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-16 flex flex-wrap gap-4">
          {STREAM_LINKS.map(({ label, href }) => (
            <LinkCard key={label} text={label} image="/images/sinjo.webp" href={href} />
          ))}
        </div>

        <p className="mb-16 text-center text-(--secondary-text-color)">
          みんなでGBBを見る会
          <br />
          ビト森にて開催します！ぜひ来てね！
        </p>

        <div className="mb-16">
          <h2 className="mb-8 text-xl font-bold">観戦のお供に</h2>
          <p className="mb-8 text-(--secondary-text-color)">
            GBB {year} の最新情報をチェックしよう
          </p>
          <div className="flex flex-wrap gap-4">
            <LinkCard
              text={
                <span>
                  {m.wildcard_result({ Wildcard: "Wildcard" })}
                  <br />
                  {m.participants()}
                </span>
              }
              image="/images/junno.webp"
              href={`/${locale}/${year}/participants`}
            />
            <LinkCard
              text={m.time_table()}
              image="/images/scott_jackson.webp"
              href={`/${locale}/${year}/timetable`}
            />
            <LinkCard
              text="現地観戦計画のたてかた"
              image="/images/zenhit.webp"
              href={`/${locale}/others/how_to_plan`}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
