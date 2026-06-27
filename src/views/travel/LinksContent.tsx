import { LinkCard } from "~/components/LinkCard.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { anchorClass } from "~/constants/linkStyle.js";

type LinksContentProps = {
  locale: SupportedLanguage;
};

export const LinksContent = ({ locale }: LinksContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className="mb-8">
          当サイトの内容（特に法制度・行政手続き等）については、事前の通告なしに変更される場合もあります。<br />
          渡航前に必ず、渡航先国の在外公館または観光局等で最新情報を確認してください。
        </p>

        <h2 className="text-xl font-bold mb-4 mt-8">政府機関・安全情報</h2>
        <ul className="list-disc pl-8 space-y-2 mb-8">
          <li>
            <a
              href="https://www.anzen.mofa.go.jp/info/pcinfectionspothazardinfo_173.html#ad-image-0"
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              ポーランド安全情報 - 外務省
            </a>
          </li>
          <li>
            <a
              href="https://www.anzen.mofa.go.jp/c_info/message.html"
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              海外旅行を予定されている皆様へ - 外務省
            </a>
          </li>
          <li>
            <a
              href="https://www.ezairyu.mofa.go.jp/tabireg/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              海外安全情報配信サービス「たびレジ」 - 外務省
            </a>
          </li>
          <li>
            <a
              href="https://www.pl.emb-japan.go.jp/itprtop_ja/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              在ポーランド日本国大使館 - 外務省
            </a>
          </li>
          <li>
            <a
              href="https://www.poland.travel/ja"
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              ポーランド政府観光局
            </a>
          </li>
          <li>
            <a
              href="https://www.gov-online.go.jp/article/202403/entry-5822.html"
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              保安検査と機内持ち込み - 政府広報オンライン
            </a>
          </li>
        </ul>

        <h2 className="text-xl font-bold mb-4 mt-8">ポーランド基本情報</h2>
        <ul className="list-disc pl-8 space-y-2 mb-16">
          <li>
            <a
              href="https://www.arukikata.co.jp/area/pl/"
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              地球の歩き方：ポーランド基本情報
            </a>
          </li>
          <li>
            <a
              href="https://study.his-j.com/article/151"
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              HIS：旅の基本情報ポーランド
            </a>
          </li>
        </ul>

        <div className="flex flex-wrap gap-4 mt-16">
          <LinkCard
            text={
              <span>
                ポーランドへ行こう<br />
                トップページへ戻る
              </span>
            }
            href={`/${locale}/travel/top`}
          />
          <LinkCard text="Home" href="/" />
        </div>
      </div>
    </main>
  );
};
