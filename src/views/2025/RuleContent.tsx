import type { ReactNode } from "react";
import { LinkCard } from "~/components/LinkCard.js";
import { PostIt } from "~/components/PostIt.js";
import { RuleSeedTable } from "~/components/RuleSeedTable.js";
import { Table } from "~/components/Table.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { anchorClass } from "~/constants/linkStyle.js";
import type { ParticipantWithRelations } from "~/db/participant.js";
import * as m from "../../../paraglide/messages.js";

type RuleSeedData = {
  gbbSeed: ParticipantWithRelations[];
  otherSeed: ParticipantWithRelations[];
  cancelled: ParticipantWithRelations[];
};

type RuleContentProps = {
  locale: SupportedLanguage;
  year: number;
  seedData: RuleSeedData;
};

const WILDCARD = "Wildcard";
const SWISSBEATBOX_SOURCE =
  "https://swissbeatbox.com/newsfeed/gbb-2025-wildcard-competition/";

const sectionClass = "mb-4 text-2xl font-bold";
const tocSectionClass = "mb-4 text-2xl font-bold";
const paragraphClass = "mb-4 leading-relaxed";
const subSectionClass = "mb-4 font-bold";
const ruleSubSectionClass = "mt-8 bg-(--section-color) px-4 py-8";
const ruleSectionClass = "bg-(--background-color) py-16 text-white";

const RuleSection = ({ children }: { children: ReactNode }) => (
  <section className={ruleSectionClass}>
    <div className="mx-auto w-full max-w-2xl px-4">{children}</div>
  </section>
);

const RuleSectionHeading = ({
  id,
  children,
  className = sectionClass,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) => (
  <h2 id={id} className={className}>
    {children}
  </h2>
);

const RuleSubSection = ({ children }: { children: ReactNode }) => (
  <div className={ruleSubSectionClass}>{children}</div>
);

const RuleSubHeading = ({ children }: { children: ReactNode }) => (
  <h3 className={subSectionClass}>{children}</h3>
);

const wildcardRulesTableData: (string | ReactNode)[][] = [
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
      {m.rule_rc505_only()}
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

const mainJudgesTableData: string[][] = [
  [m.rule_col_category(), m.rule_col_judges()],
  ["Solo", "RIVER'\nPE4ENKATA\nD-LOW\nBALL-ZEE\nTRUNG BAO"],
  ["Tag Team", "COLAPS\nD-LOW\nJOHN T\nALEXINHO\nZHANG ZE"],
  ["Loopstation", "SO-SO\nSARO\nKBA\nINKIE\nBEARDYMAN"],
  ["Producer", "SO-SO\nKBA\nINKIE\nBEARDYMAN\nZHANG ZE"],
  ["Crew", "SO-SO\nD-LOW\nMB14\nBALL-ZEE\nZHANG ZE"],
  ["7toSmoke", `${m.rule_judges_unknown()}\n${m.rule_judges_not_announced()}`],
  [m.rule_referee(), "KRISTOF"],
];

const wildcardJudgesTableData: string[][] = [
  [m.rule_col_category(), m.rule_col_judges()],
  ["Solo", "FOOTBOXG\nD-LOW\nTRUNG BAO"],
  ["Tag Team", "D-LOW\nCOLAPS\nYAMORI"],
  ["Loopstation", "BREZ\nKRISTOF\nFROSTY"],
  ["Producer", "KBA\nKRISTOF\nFROSTY"],
  ["Crew", "KRISTOF\nD-LOW\nZHANG ZE"],
];

export const RuleContent = ({ locale, year, seedData }: RuleContentProps) => {
  const participantsPath = `/${locale}/${year}/participants`;
  const teamHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const teamLabel = locale === "ko" ? m.team_korea() : m.team_japan();

  return (
    <main className="bg-(--background-color) pt-16">
      <RuleSection>
        <p className={paragraphClass}>
          {m.rule_intro({ year: String(year), Wildcard: WILDCARD })}
          <br />
          {m.rule_source_site()}：
          <a
            href={SWISSBEATBOX_SOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            GBB 2025 Wildcard Competition
          </a>
        </p>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.wildcard_list({ Wildcard: WILDCARD })}
            href={`/${locale}/${year}/wildcards`}
            fullWidth
          />
        </div>
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={
              <span>
                【Beatboxer向け】
                <br />
                {WILDCARD}レギュレーション解説
              </span>
            }
            href={`/${locale}/${year}/wildcard_regulation`}
            fullWidth
          />
        </div>

        <RuleSectionHeading id="toc-section" className={tocSectionClass}>
          {m.rule_toc()}
        </RuleSectionHeading>
        <ol className="mb-8 list-decimal space-y-2 pl-8">
          <li>
            <a href="#notices-section" className={anchorClass}>
              {m.rule_toc_notices()}
            </a>
          </li>
          <li>
            <a href="#category-section" className={anchorClass}>
              {m.rule_toc_categories()}
            </a>
          </li>
          <li>
            <a href="#seeds-section" className={anchorClass}>
              出場シード権 獲得条件
            </a>
          </li>
          <li>
            <a href="#wildcard-rules-section" className={anchorClass}>
              Wildcard {m.rule_wildcard_deadline()}
            </a>
          </li>
          <li>
            <a href="#main-judges-section" className={anchorClass}>
              GBB {year} {m.rule_main_judges()}
            </a>
          </li>
          <li>
            <a href="#wildcard-judges-section" className={anchorClass}>
              {m.rule_wildcard_judges({ Wildcard: WILDCARD })}
            </a>
          </li>
        </ol>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="notices-section">
          {m.rule_toc_notices()}
        </RuleSectionHeading>
        <p className={paragraphClass}>
          {m.rule_notices_p1({ Beatbox: "Beatbox" })}
          <br />
          {m.rule_notices_p1_note()}
          <strong>{m.rule_notices_p1_strong()}</strong>
        </p>
        <p className={paragraphClass}>
          {m.rule_notices_p2()}
          <br />
          {m.rule_notices_p2_prefix({ Wildcard: WILDCARD })}
          <strong className="text-red-500">{m.rule_notices_p2_strong()}</strong>
        </p>
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={
              <span>
                {m.wildcard_result({ Wildcard: WILDCARD })}
              </span>
            }
            href={participantsPath}
            fullWidth
          />
        </div>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="category-section">
          {m.rule_toc_categories()}
        </RuleSectionHeading>
        <Table
          data={[
            [m.rule_col_category(), "Wildcard", "シード", m.rule_col_total()],
            ["Solo", "6", "10", "16"],
            ["Loopstation", "5", "3", "8"],
            ["Crew", "2", "1", "3"],
            ["Producer", "2", "0", "2"],
            ["Tag Team", "5", "3", "8"],
          ]}
          textCenter
        />
        <p className={paragraphClass}>{m.rule_category_note()}</p>
        <p className={paragraphClass}>
          {m.rule_forgotten_ttl({ TagTeamLoopstation: "Tag Team Loopstation" })}
          😭
        </p>

        <RuleSubSection>
          <RuleSubHeading>Producerとは</RuleSubHeading>
          <p className={paragraphClass}>
            Loopstationのセカンドデバイス（Loopstationに接続する端末）ありの部門で、GBB23で「Producer
            showcase」として新設されました。その代わり、Loopstation部門においてセカンドデバイスの使用が禁止されます。
          </p>
        </RuleSubSection>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={
              <span>
                【Beatboxer向け】
                <br />
                {WILDCARD}レギュレーション解説
              </span>
            }
            href={`/${locale}/${year}/wildcard_regulation`}
            fullWidth
          />
        </div>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="seeds-section">
          出場シード権 獲得条件
        </RuleSectionHeading>
        <p className={paragraphClass}>
          Wildcardを勝ち上がる以外の方法でGBB出場権を得る方法（シード権）と、その該当者は以下の通りです。
        </p>

        <RuleSubSection>
          <RuleSubHeading>シード権 - GBB</RuleSubHeading>
          <RuleSeedTable participants={seedData.gbbSeed} locale={locale} />
        </RuleSubSection>

        <RuleSubSection>
          <RuleSubHeading>シード権 - その他</RuleSubHeading>
          <RuleSeedTable participants={seedData.otherSeed} locale={locale} />
        </RuleSubSection>

        <RuleSubSection>
          <RuleSubHeading>シード権辞退者一覧</RuleSubHeading>
          <RuleSeedTable participants={seedData.cancelled} cancelled locale={locale} />
        </RuleSubSection>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.wildcard_result({ Wildcard: WILDCARD })}
            href={participantsPath}
          />
          <LinkCard
            text={m.rule_participants_list()}
            href={participantsPath}
          />
        </div>

        <p className={paragraphClass}>
          {m.rule_replacement_intro({ Wildcard: WILDCARD })}
        </p>
        <PostIt>
          <p className="mb-4">
            <strong>
              いかなる理由があっても、シード権大会2位以下の人に、出場権は与えられません。
            </strong>
            <br />
            「シード権大会においてGBB出場権が与えられるのは、例外なく、常に優勝者のみである」とルールに明記されています。
          </p>
          <p>
            例：シード権大会優勝者が、すでにWildcardで出場権を獲得していた場合、シード権大会2位ではなく、Wildcard下位からの繰り上げが行われます。
          </p>
        </PostIt>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard text={teamLabel} href={teamHref} fullWidth />
        </div>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="wildcard-rules-section">
          Wildcard {m.rule_wildcard_deadline()}
        </RuleSectionHeading>
        <Table data={wildcardRulesTableData} textCenter />
        <PostIt>
          <p>
            ※中央ヨーロッパ時間には、サマータイムがあります。2025年のサマータイムは3/30からです。
            <br />
            Tag Team部門・Crew部門参加希望の方はご注意ください。
          </p>
        </PostIt>

        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.wildcard_stream({ Wildcard: WILDCARD })}
            href={`/${locale}/others/result_stream`}
            fullWidth
          />
        </div>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="main-judges-section">
          {m.rule_main_judges()}
        </RuleSectionHeading>
        <p className="mb-8 text-center">
          <a href="#wildcard-judges-section" className={anchorClass}>
            {m.rule_wildcard_judges_link({ Wildcard: WILDCARD })}
          </a>
        </p>
        <Table data={mainJudgesTableData} textCenter />
        <PostIt>
          <p>
            <strong>{m.rule_referee_about()}</strong>
            <br />
            {m.rule_referee_detail()}
          </p>
        </PostIt>
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={
              <span>
                {m.wildcard_result({ Wildcard: WILDCARD })}
                <br />
                {m.participants()}
              </span>
            }
            href={participantsPath}
            fullWidth
          />
        </div>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="wildcard-judges-section">
          {m.rule_wildcard_judges({ Wildcard: WILDCARD })}
        </RuleSectionHeading>
        <Table data={wildcardJudgesTableData} textCenter />
        <p className="mb-8 mt-8 text-center">
          <a href="#main-judges-section" className={anchorClass}>
            {m.rule_main_judges_link({ year: String(year) })}
          </a>
        </p>
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard
            text={m.wildcard_list({ Wildcard: WILDCARD })}
            href={`/${locale}/${year}/wildcards`}
            fullWidth
          />
        </div>
      </RuleSection>
    </main>
  );
};
