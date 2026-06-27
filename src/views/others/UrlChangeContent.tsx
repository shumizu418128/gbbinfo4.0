import type { SupportedLanguage } from "~/constants/languageLabels.js";

type UrlChangeContentProps = {
  locale: SupportedLanguage;
};

const anchorClass =
  "text-(--gbb-color) underline transition-colors duration-150 hover:text-white";

const paragraphClass = "mb-4 leading-relaxed";

export const UrlChangeContent = ({ locale }: UrlChangeContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <h1 className="mb-8 text-2xl font-bold">URL変更のお知らせ</h1>
        <p className={paragraphClass}>当サイトのURLが変更されました。</p>
        <p className={paragraphClass}>
          旧URL：https://gbbinfo-jpn.jimdofree.com/
          <br />
          <strong>
            新URL：
            <a href={`/${locale}/`} className={anchorClass}>
              https://gbbinfo-jpn.onrender.com/
            </a>
          </strong>
        </p>
        <p className={paragraphClass}>
          お気に入りやブックマークなどに登録されている方は、お手数ですが新URLへの変更をお願いいたします。
        </p>
      </div>
    </main>
  );
};
