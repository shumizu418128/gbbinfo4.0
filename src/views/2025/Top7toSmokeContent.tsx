import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { LinkCard } from "~/components/LinkCard.js";
import * as m from "../../../paraglide/messages.js";

type Top7toSmokeContentProps = {
  locale: SupportedLanguage;
  year: number;
};

export const Top7toSmokeContent = ({ locale, year }: Top7toSmokeContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-16 text-center">
          <p className="mb-4 text-xl">7toSmoke: 11/3</p>
          <p className="text-(--secondary-text-color)">
            公式よりもわかりやすい！
            <br />
            GBB {year} 7toSmoke 非公式情報サイト
          </p>
        </div>

        <div className="mb-16 flex flex-wrap gap-4">
          <LinkCard text="7toSmokeとは" image="/images/afterparty.webp" href={`/${locale}/others/7tosmoke`} />
          <LinkCard text="7toSmokeルール & 参加方法" image="/images/afterparty.webp" href={`/${locale}/others/7tosmoke`} />
          <LinkCard text={m.venue_tickets()} image="/images/dice.webp" href={`/${locale}/${year}/ticket`} />
          <LinkCard text="現地観戦計画のたてかた" image="/images/zenhit.webp" href={`/${locale}/others/how_to_plan`} />
        </div>

        <div className="mb-16 flex flex-wrap gap-4">
          <LinkCard
            text={m.time_table()}
            image="/images/scott_jackson.webp"
            href={`/${locale}/${year}/timetable?scroll=7tosmoke`}
          />
          <LinkCard text={m.livestream()} image="/images/sinjo.webp" href={`/${locale}/${year}/stream`} />
        </div>

        <div className="mb-16 space-y-4 text-(--secondary-text-color)">
          <p>
            7toSmokeは、GBB本戦に比べて最新情報の公開が非常に遅い傾向にあり、そもそも情報が発表されないまま本番を迎えてしまったケースもあります。
          </p>
          <p>諦めましょう。</p>
        </div>
      </div>
    </main>
  );
};
