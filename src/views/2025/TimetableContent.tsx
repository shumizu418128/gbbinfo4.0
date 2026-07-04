import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { LinkCard } from "~/components/LinkCard.js";
import { Table } from "~/components/Table.js";
import { anchorClass } from "~/constants/linkStyle.js";
import * as m from "../../../paraglide/messages.js";

type TimetableContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const paragraphClass = "mb-4 leading-relaxed text-(--secondary-text-color)";
const sectionHeadingClass = "mb-4 mt-16 text-2xl font-bold";

export const TimetableContent = ({ locale, year }: TimetableContentProps) => {
  const teamHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const teamLabel = locale === "ko" ? m.team_korea() : m.team_japan();

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className={paragraphClass}>時刻はあくまでも予定です。</p>
        <p className={paragraphClass}>GBB21では、予定から約2時間遅延しました。</p>
        <p className={paragraphClass}>
          GBB23では、本番7日前に日本語版・英語版のタイムテーブルが公開されましたが、日本語版のみ正しく、英語版には誤記が多くみられました。
        </p>
        <p className={paragraphClass}>
          GBB24では、本番約1ヶ月前に公開されましたが、誤記が多くみられました。
        </p>

        <h2 className="mb-4 mt-16 text-xl font-bold">{m.rule_toc()}</h2>
        <ol className="mb-16 list-decimal space-y-2 pl-8">
          <li>
            <a href="#day1" className={anchorClass}>
              Day1 - 10/31
            </a>
          </li>
          <li>
            <a href="#day2" className={anchorClass}>
              Day2 - 11/1
            </a>
          </li>
          <li>
            <a href="#day3" className={anchorClass}>
              Day3 - 11/2
            </a>
          </li>
          <li>
            <a href="#seven-to-smoke" className={anchorClass}>
              7toSmoke - 11/3
            </a>
          </li>
        </ol>

        <h2 id="day1" className={sectionHeadingClass}>
          Day1 - 10/31
        </h2>
        <p className={paragraphClass}>EX THEATER ROPPONGI</p>
        <p className={paragraphClass}>JST GMT+9</p>
        <Table
          data={[
            ["時刻", "内容"],
            ["14:00", "入場開始"],
            ["14:55", "サプライズゲスト"],
            ["15:15", "オープニング"],
            ["-", "SPECIAL SHOWCASE"],
            ["-", "Crew 予選"],
            ["-", "Tag Team 予選"],
            ["-", "休憩"],
            ["-", "SPECIAL SHOWCASE"],
            ["-", "Crew 決勝"],
            ["-", "Producer 予選"],
            ["-", "SPECIAL SHOWCASE"],
            ["19:30", "終了"],
          ]}
          textCenter
        />
        <p className={paragraphClass}>
          タイムテーブルの終了時刻は19:30になっていますが、なぜか中継配信は21時まで行われるようです。理由は不明です。初日も21時まで行われるのかどうかも不明です。
        </p>
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text="現地観戦計画のたてかた"
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard
            text={<span>{m.rules()}<br />{m.judges()}</span>}
            href={`/${locale}/${year}/rule`}
          />
        </div>

        <h2 id="day2" className={sectionHeadingClass}>
          Day2 - 11/1
        </h2>
        <p className={paragraphClass}>EX THEATER ROPPONGI</p>
        <p className={paragraphClass}>JST GMT+9</p>
        <Table
          data={[
            ["時刻", "内容"],
            ["13:00", "入場開始"],
            ["13:45", "サプライズゲスト"],
            ["14:15", "オープニング"],
            ["", "SPECIAL SHOWCASE"],
            ["", "Loopstation 準々決勝"],
            ["", "休憩"],
            ["", "Solo 予選"],
            ["", "Producer 予選 2"],
            ["", "SPECIAL SHOWCASE"],
            ["19:12", "終了"],
          ]}
          textCenter
        />
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard text={m.livestream()} href={`/${locale}/${year}/stream`} />
          <LinkCard
            text={
              <span>
                {m.wildcard_result({ Wildcard: "Wildcard" })}
                <br />
                {m.participants()}
              </span>
            }
            href={`/${locale}/${year}/participants`}
          />
        </div>

        <h2 id="day3" className={sectionHeadingClass}>
          Day3 - 11/2
        </h2>
        <p className={paragraphClass}>EX THEATER ROPPONGI</p>
        <p className={paragraphClass}>JST GMT+9</p>
        <Table
          data={[
            ["時刻", "内容"],
            ["13:15", "入場開始"],
            ["14:00", "サプライズゲスト"],
            ["14:30", "オープニング"],
            ["", "SPECIAL SHOWCASE"],
            ["", "Loopstation 準決勝・3位決定戦・決勝"],
            ["", "Solo 準々決勝"],
            ["", "休憩"],
            ["", "Producer 決勝"],
            ["", "Tag Team 準決勝"],
            ["", "Solo 準決勝"],
            ["", "Tag Team 3位決定戦・決勝"],
            ["", "Solo 3位決定戦・決勝"],
            ["", "SPECIAL SHOWCASE"],
            ["19:58", "セレモニー"],
            ["21:00", "終了"],
          ]}
          textCenter
        />
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text="現地観戦計画のたてかた"
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard text={teamLabel} href={teamHref} />
        </div>

        <h2 id="seven-to-smoke" className={sectionHeadingClass}>
          7toSmoke - 11/3
        </h2>
        <p className={paragraphClass}>Spotify O-EAST</p>
        <p className={paragraphClass}>JST GMT+9</p>
        <Table
          data={[
            ["時刻", "内容"],
            ["14:20", "入場開始"],
            ["15:00", "スタート"],
            ["16:30", "ABEMA配信スタート"],
            ["発表次第更新", "終了"],
          ]}
          textCenter
        />
        <p className={paragraphClass}>
          7toSmoke開始時刻と配信スタート時刻が違う理由は不明です。
        </p>
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text="現地観戦計画のたてかた"
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard text="7toSmoke" href={`/${locale}/${year}/top_7tosmoke`} />
        </div>
      </div>
    </main>
  );
};
