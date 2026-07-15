import { LinkCard } from "~/components/LinkCard.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { GBB } from "~/constants/i18nTerms.js";
import { anchorClass } from "~/constants/linkStyle.js";

type ResultStreamContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const paragraphClass = "mb-4 leading-relaxed";

export const ResultStreamContent = ({ locale, year }: ResultStreamContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className={paragraphClass}>
          GBBのWildcard審査結果は、例年、Swissbeatboxの公式YouTubeチャンネルで公開されます。世界中のトップクラスのBeatboxerが、こぞってGBB各部門のWildcardを提出します。しかし、近年Wildcard出場枠が減少傾向にあり、過去にGBB出場経験がある有名なBeatboxerが、出場どころか上位にすら入れないことも当たり前になってきました。
        </p>
        <p className={paragraphClass}>
          そのため、結果が発表されると、毎年必ず結果に対する不満が噴出し、YouTubeコメント欄は批判的な意見や誹謗中傷で溢れ返ります。GBB23 Wildcard結果発表ライブのコメント欄では、例年以上に批判的な意見や誹謗中傷が多くみられ、SNS上でも非難が殺到しました。
        </p>
        <p className={paragraphClass}>
          Wildcard結果発表のコメント欄は、
          <strong className="text-red-500">精神衛生に悪影響を及ぼします。</strong>
          GBBINFO-JPNは、今後結果発表
          <strong className="text-red-500">配信のURLを一切掲載せず、</strong>
          Wildcard結果のみ掲載します。
        </p>
        <p className={paragraphClass}>Wildcard結果発表を見る際は、YouTubeコメント欄を絶対に見ないでください。</p>
        <p className="mb-8 text-center text-2xl font-bold text-red-500">後悔しますよ、マジで</p>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text="Wildcard結果 & 出場者"
            href={`/${locale}/${year}/participants`}
            fullWidth
          />
          <LinkCard
            text="Wildcard結果発表日"
            href={`/${locale}/${year}/rule?scroll=result_date`}
            fullWidth
          />
        </div>

        <img
          alt="自己防衛"
          src="https://live.staticflickr.com/65535/53462882364_331151250a_o.jpg"
          className="mx-auto mb-8 block w-full"
          loading="lazy"
          decoding="async"
        />
        <p className={paragraphClass}>
          <a
            href="https://twitter.com/tpyclub/status/1746820254637171013"
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            https://twitter.com/tpyclub/status/1746820254637171013
          </a>
        </p>
        <p className={paragraphClass}>Wildcard結果発表を見る際は、YouTubeコメント欄を絶対に見ないでください。</p>
        <p className="mb-8">つまり、自己防衛。</p>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={`${GBB} ${year} ルール & 審査員`}
            href={`/${locale}/${year}/rule`}
            fullWidth
          />
          <LinkCard text="Wildcard一覧" href={`/${locale}/${year}/wildcards`} fullWidth />
        </div>
        <div className="flex flex-wrap gap-4">
          <LinkCard
            text="Wildcard結果 & 出場者"
            href={`/${locale}/${year}/participants`}
            fullWidth
          />
          <LinkCard
            text="Wildcard結果発表日"
            href={`/${locale}/${year}/rule?scroll=result_date`}
            fullWidth
          />
        </div>
      </div>
    </main>
  );
};
