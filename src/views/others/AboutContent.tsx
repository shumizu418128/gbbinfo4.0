import type { SupportedLanguage } from "~/constants/languageLabels.js";

type AboutContentProps = {
  locale: SupportedLanguage;
};

const anchorClass =
  "text-(--gbb-color) underline transition-colors duration-150 hover:text-white";

const paragraphClass = "mb-4 leading-relaxed";

export const AboutContent = ({ locale: _locale }: AboutContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <h1 className="mb-8 text-2xl font-bold">GBBINFO-JPNについて</h1>
        <p className={paragraphClass}>
          はじめまして、このサイトの管理人です。
          <br />
          このサイトは、名前の通りGrand Beatbox Battleに関する情報を日本語でまとめるために作成しました。
        </p>
        <p className={paragraphClass}>
          GBB2021は、大成功を収め終了しました。
          <br />
          日本国内のツイッターでは、GBBだけでなく、Rofu、SARUKANI、そしてOnii-chanといったワードが次々トレンド入りしました。これは２年前まで考えられなかったことであり、最近Beatboxを知った人も、昔からBeatboxが大好きな人も、多くの人が２年ぶりの世界大会開催を喜びました。
        </p>
        <p className={paragraphClass}>
          しかし、残念ながらこの大会の情報はすべて英語で発信されており、日本の人にとって情報を手に入れるのが難しい状況が続きました。
          <br />
          この状況を次のGBBまでに改善するため、この度GBBINFO-JPNというサイトを立ち上げ、運営SNSの翻訳、また非公式の情報までもここにまとめていきます。
        </p>
        <p className={paragraphClass}>ぜひ、拡散よろしくお願いします。</p>
        <p className={paragraphClass}>
          ※なお、このサイトはSwissbeatbox・GBB運営によって運営されているものではありません。あくまで有志メンバーが情報をまとめるだけのサイトとなっていますのでご注意ください。
          <br />
          ※サイト内で示している情報は、基本的に管理人本人が撮影した画像、もしくは管理人が著作者から許可を得たもののみが使用されています。その他（Swissbeatboxからの情報など）の場合、必ずソースURLもしくは情報提供者を示します。
          <br />
          ※当サイトへのお問い合わせは、管理人のTwitterDMにお願いします。ただし、当サイトはGBB運営とは無関係であること、ご留意ください。
        </p>
        <p className={paragraphClass}>
          2021/10/29 旧サイト開設
          <br />
          2024/6/23 新サイトへ移行
          <br />
          2024/12/14 株式会社サポーターズ様主催イベント「技育博 Vol.5」オフライン決勝進出作品
          <br />
          2026年現在 累計ユーザー数30万人突破
        </p>
        <p className={paragraphClass}>
          <a
            href="https://twitter.com/tari_3210_"
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            管理人 tari3210
          </a>
        </p>
      </div>
    </main>
  );
};
