import { Table } from "~/components/Table.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { anchorClass } from "~/constants/linkStyle.js";

type PastInfoContentProps = {
  locale: SupportedLanguage;
};

const paragraphClass = "mb-4 leading-relaxed";

const PAST_INFO_DATA = [
  ["年度", "状況", "説明"],
  ["2024\nそれ以降", "〇", ""],
  [
    "2023",
    "△",
    "旧開発体制下で作成されたものをそのまま移行したため、一部レイアウトが意図しない表示になっている場合があります。",
  ],
  ["2022", "×", "中止"],
  ["2021", "〇", "2025年1月公開"],
  [
    "2020",
    "〇",
    "本来開催される予定だったGBB 2020は中止されているため、代わりにGBB 2020 Onlineの情報を掲載しています。",
  ],
  ["2019", "〇", "2025年1月公開"],
  ["2018", "〇", "2025年1月公開"],
  ["2017", "〇", "2025年1月公開"],
  ["2016", "△", "出場者一覧のみ対応"],
  ["2015", "△", "出場者一覧のみ対応"],
  ["2014", "△", "出場者一覧のみ対応"],
  ["2013", "△", "出場者一覧のみ対応"],
  ["2012\nそれ以前", "×", "対応予定なし"],
];

export const PastInfoContent = ({ locale }: PastInfoContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className={paragraphClass}>
          GBBINFO-JPNは、
          <a href={`/${locale}/others/about`} className={anchorClass}>
            2021年10月に初公開、2024年6月に現在の開発体制に移行しました。
          </a>
          <br />
          それ以前に開催されたGBBの情報の対応状況は以下の通りです。
        </p>
        <Table data={PAST_INFO_DATA} />
      </div>
    </main>
  );
};
