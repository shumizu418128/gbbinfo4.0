import type { ReactNode } from "react";
import { LinkCard } from "~/components/LinkCard.js";
import { PostIt } from "~/components/PostIt.js";
import { Table } from "~/components/Table.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import {
  BEATBOX,
  RC505,
  SWISSBEATBOX,
  WILDCARD,
} from "~/constants/i18nTerms.js";
import { anchorClass } from "~/constants/linkStyle.js";
import * as m from "../../../paraglide/messages.js";

type WildcardRegulationContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const SWISSBEATBOX_SOURCE =
  "https://swissbeatbox.com/newsfeed/gbb-2025-wildcard-competition/";

const sectionClass = "mb-4 text-2xl font-bold";
const paragraphClass = "mb-4 leading-relaxed";
const ruleSectionClass = "bg-(--background-color) py-16 text-white";

const RuleSection = ({ children }: { children: ReactNode }) => (
  <section className={ruleSectionClass}>
    <div className="mx-auto w-full max-w-2xl px-4">{children}</div>
  </section>
);

const categoryRulesTableData: (string | ReactNode)[][] = [
  [m.rule_col_category(), m.rule_col_deadline_rule()],
  [
    m.rule_all_categories(),
    <>
      {m.rule_submission_start()} 2/15
      <br />
      {m.rule_penalty_overtime()}
      <br />
      制限時間を使い切らず余らせた場合、3秒につき最終順位を1つ下げる
    </>,
  ],
  [
    "Solo",
    <>
      {m.rule_time_limit()} 2:10
      <br />
      {m.rule_submission_deadline()} 3/22 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 4/16 (18:00 JST)
    </>,
  ],
  [
    "Tag Team",
    <>
      {m.rule_time_limit()} 2:10
      <br />
      {m.rule_submission_deadline()} 4/5 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 4/24 時間未定
    </>,
  ],
  [
    "Loopstation",
    <>
      {m.rule_time_limit()} 3:30
      <br />
      {m.rule_submission_deadline()} 3/22 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 4/19 (18:00 JST)
      <br />
      {m.rule_rc505_only({ RC505 })}
    </>,
  ],
  [
    "Producer",
    <>
      {m.rule_time_limit()} 3:30
      <br />
      {m.rule_submission_deadline()} 3/29 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 4/22 時間未定
      <br />
      {m.rule_no_device_limit()}
    </>,
  ],
  [
    "Crew",
    <>
      {m.rule_time_limit()} 3:10
      <br />
      {m.rule_submission_deadline()} 4/5 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 4/26 時間未定
    </>,
  ],
];

const guideLinkCards = (locale: SupportedLanguage, year: number) => (
  <div className="mb-8 flex flex-wrap gap-4">
    <LinkCard
      text={`GBB ${year} これだけガイド`}
      href={`/${locale}/${year}/top`}
    />
    <LinkCard
      text="7toSmoke これだけガイド"
      href={`/${locale}/${year}/top_7tosmoke`}
    />
  </div>
);

export const WildcardRegulationContent = ({
  locale,
  year,
}: WildcardRegulationContentProps) => {
  return (
    <main className="bg-(--background-color) pt-16">
      <RuleSection>
        <p className="mb-8 text-center text-3xl font-bold">- For Beatboxers -</p>
        <hr className="mb-8 border-(--gbb-color)" />
        <p className={paragraphClass}>
          {m.rule_intro({
            year: String(year),
            Wildcard: WILDCARD,
            Swissbeatbox: SWISSBEATBOX,
          })}
          <br />
          {m.rule_source_site()}：
          <a
            href={SWISSBEATBOX_SOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            GBB {year} Wildcard Competition
          </a>
          <br />
          このページでは、{WILDCARD}提出にあたって重要なルールを解説します。
        </p>

        <div className="mb-8 flex flex-wrap gap-4">
          {guideLinkCards(locale, year)}
          <LinkCard
            text={
              <span>
                {m.rule_for_fans({ Beatbox: BEATBOX })}
                <br />
                GBB {year} {m.rules()}
              </span>
            }
            href={`/${locale}/${year}/rule`}
          />
        </div>

        <h2 className={sectionClass}>{m.rule_toc()}</h2>
        <ol className="mb-8 list-decimal space-y-2 pl-8">
          <li>
            <a href="#p01" className={anchorClass}>
              {m.rule_toc_notices()}
            </a>
          </li>
          <li>
            <a href="#p02" className={anchorClass}>
              {m.rule_toc_categories()}
            </a>
          </li>
          <li>
            <a href="#p03" className={anchorClass}>
              年齢制限
            </a>
          </li>
          <li>
            <a href="#p04" className={anchorClass}>
              {WILDCARD}提出について
            </a>
          </li>
          <li>
            <a href="#p05" className={anchorClass}>
              部門別ルール
            </a>
          </li>
          <li>
            <a href="#p06" className={anchorClass}>
              失格にならないために
            </a>
          </li>
        </ol>
        {guideLinkCards(locale, year)}
      </RuleSection>

      <RuleSection>
        <h2 id="p01" className={sectionClass}>
          {m.rule_toc_notices()}
        </h2>
        <p className={paragraphClass}>
          以下に示す内容は、{WILDCARD}を作るBeatboxer向けの情報です。
          <br />
          当サイト管理人はBeatboxerではありません。また、当サイト管理人はGBB運営と一切無関係です。
        </p>
        <p className={paragraphClass}>
          {m.rule_notices_p2()}
          <br />
          {m.rule_notices_p2_prefix({ Wildcard: WILDCARD })}
          <strong className="text-red-500">{m.rule_notices_p2_strong()}</strong>
        </p>
        <p className={`${paragraphClass} text-(--secondary-text-color)`}>
          For Non-Japanese Users: Please note that this article was originally written in
          Japanese and subsequently translated using AI. As a result, there may be instances
          of inaccurate translation. For any questions or concerns, please refer to the
          official website or social media channels.
        </p>
        {guideLinkCards(locale, year)}
      </RuleSection>

      <RuleSection>
        <h2 id="p02" className={sectionClass}>
          {m.rule_toc_categories()}
        </h2>
        <Table
          data={[
            [m.rule_col_category(), "Wildcard"],
            ["Solo", "6"],
            ["Loopstation", "5"],
            ["Crew", "2"],
            ["Producer", "2"],
            ["Tag Team", "5"],
          ]}
          textCenter
        />
        <p className={paragraphClass}>{m.rule_category_note()}</p>
        {guideLinkCards(locale, year)}
      </RuleSection>

      <RuleSection>
        <h2 id="p03" className={sectionClass}>
          年齢制限
        </h2>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>年齢制限: 本番当日、16歳以上であること</li>
          <li>
            未成年者(18歳未満)の参加:
            <ul className="mt-2 list-disc space-y-2 pl-8">
              <li>保護者の同伴が必須</li>
              <li>
                主催者は、保護者の同伴にかかる費用(ビザ、フライト、ホテル、食事など)を負担しない
              </li>
              <li>
                上記要件を満たさない、同意できない場合は失格となり、{WILDCARD}
                下位からの繰り上げが行われる
              </li>
            </ul>
          </li>
        </ul>
        {guideLinkCards(locale, year)}
      </RuleSection>

      <RuleSection>
        <h2 id="p04" className={sectionClass}>
          {WILDCARD}作成・提出について
        </h2>

        <h3 className="mb-4 font-bold">{WILDCARD}動画の内容</h3>
        <p className={paragraphClass}>動画の冒頭で、以下のように自己紹介する</p>
        <p className={`${paragraphClass} italic`}>
          &quot;My name is 【名前】, and this is my 【部門】 wildcard for the GBB {year}{" "}
          World League.&quot;
        </p>
        <PostIt>
          <p>
            このルールに関する表記は、原文では非常に強い表現で示されています。
            <br />
            また、過去にこのルールに違反したことで失格処分になった事例があります。
          </p>
        </PostIt>

        <h3 className="mb-4 mt-8 font-bold">録音方法</h3>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>カメラにはっきり映っていること (マスクや視覚効果で顔や口を覆わないこと)</li>
          <li>リップシンクやその他のビデオ技術は禁止</li>
          <li>撮影と録音は、同時に行うこと</li>
          <li>
            基本的なダイナミック (コンプレッション)、EQ プラグイン、リバーブは使用可能。ただし、録音自体は生の状態で行い、後で編集すること
          </li>
          <li>キックとスネアに異なる EQ やコンプレッションを施すなどの自動処理は禁止</li>
          <li>録音全体を同じように処理すること</li>
          <li>歪み、遅延、その他の動的処理、周波数歪み効果は禁止</li>
          <li className="font-bold text-red-500">
            上記ルールについて、不正行為の疑いがある場合、{WILDCARD}
            作成に使ったファイルの追加提出を求められる場合あり
          </li>
        </ul>

        <h3 className="mb-4 font-bold">提出方法</h3>
        <ol className="mb-4 list-decimal space-y-2 pl-8">
          <li>{WILDCARD}をYouTubeにアップロード</li>
          <li>Swissbeatbox公式サイトにある申請フォームで提出</li>
        </ol>
        <ul className="mb-4 list-disc space-y-2 pl-8">
          <li className="font-bold text-red-500">上記2つが両方できていない場合は、失格</li>
        </ul>
        <ul className="mb-4 list-disc space-y-2 pl-8">
          <li className="font-bold text-red-500">
            毎年必ず、申請フォーム入力忘れによる失格者が発生します！！！
          </li>
        </ul>
        <p className={paragraphClass}>
          ぜひここのスクリーンショットをとってSNSで拡散してください。推しが失格にならないために...
        </p>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>生のオーディオと生のビデオ (カメラのオーディオを含む) の提出が必要</li>
          <li>Solo以外の全部門は、録画中のスクリーンキャプチャの提出も必要</li>
          <li className="font-bold text-red-500">上記2つが無い場合は、失格</li>
          <li>
            {WILDCARD}提出は一度のみ。一度提出したら、後から別の{WILDCARD}
            を提出することはできない
          </li>
          <li className="font-bold text-red-500">
            誤って一度提出した{WILDCARD}を削除した場合、失格
            <ul className="mt-2 list-disc pl-8 font-normal text-white">
              <li>このルールは、GBB 2019で発生したトラブルの対策として設けられている</li>
            </ul>
          </li>
        </ul>
        {guideLinkCards(locale, year)}
      </RuleSection>

      <RuleSection>
        <h2 id="p05" className={sectionClass}>
          部門別ルール
        </h2>
        <Table data={categoryRulesTableData} textCenter />
        <PostIt>
          <p>
            ※中央ヨーロッパ時間には、サマータイムがあります。2025年のサマータイムは3/30からです。
            <br />
            Tag Team部門・Crew部門参加希望の方はご注意ください。
          </p>
        </PostIt>

        <h3 className="mb-4 mt-8 font-bold">Loopstation デバイスルール</h3>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>MIDIコントローラーの使用は禁止</li>
          <li>マシン内の追加ケーブルは使用可能 ケーブルはデバイスではないとみなされる</li>
        </ul>

        <h3 className="mb-4 font-bold">Producer デバイスルール</h3>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>Loopstation単体での出場は禁止</li>
          <li className="font-bold text-red-500">
            事前にデバイス構成をSUPPORT@swissbeatbox.comへ申請すること
          </li>
          <li>ボイスソース、ボイストリガーのみ</li>
          <li>事前に録音されたサンプルは使用禁止</li>
          <li>
            FOH (ミキシング デスク) または録音への出力はステレオ信号である必要があり、マルチチャンネル出力は禁止
          </li>
        </ul>
        {guideLinkCards(locale, year)}
      </RuleSection>

      <RuleSection>
        <h2 id="p06" className={sectionClass}>
          失格にならないために
        </h2>
        <ol className="mb-8 list-decimal space-y-4 pl-8">
          <li>
            <strong>Swissbeatbox公式サイトにある申請フォームで提出</strong>
          </li>
          <li>
            <strong>
              {WILDCARD}
              動画の作成にあたり使用したすべてのファイルを、バックアップ含め保存しておき、いつでも提出できるようにしておく
            </strong>
          </li>
          <li>
            <strong>
              {WILDCARD}提出は一度のみ。一度提出したら、後から別の{WILDCARD}
              を提出することはできない
            </strong>
          </li>
        </ol>
        <p className="mb-8 text-center">
          皆さんの{WILDCARD}を楽しみにしています！
          <br />
          Good luck have fun!
        </p>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>
            <a
              href="https://twitter.com/TWlCER/status/1881662085576442197"
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              dupo (@TWlCER) — GBB25 ワイルドカードサムネイル作成
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/impedanceryuma/status/1894719533031784655"
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              Impedance (@impedanceryuma) — GBB wildcardマスタリング
            </a>
          </li>
        </ul>
      </RuleSection>
    </main>
  );
};
