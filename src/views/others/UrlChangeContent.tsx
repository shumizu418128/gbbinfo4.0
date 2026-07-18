import { JapaneseOnlyPageNotice } from "~/components/JapaneseOnlyPageNotice.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { anchorClass } from "~/constants/linkStyle.js";

type UrlChangeContentProps = {
  locale: SupportedLanguage;
};

const paragraphClass = "mb-4 leading-relaxed";

export const UrlChangeContent = ({ locale }: UrlChangeContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <JapaneseOnlyPageNotice />
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
