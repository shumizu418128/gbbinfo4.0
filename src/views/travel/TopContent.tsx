import { LinkCard } from "~/components/LinkCard.js";
import { PostIt } from "~/components/PostIt.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";

type TopContentProps = {
  locale: SupportedLanguage;
};

export const TopContent = ({ locale }: TopContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className="mb-4">
          ワルシャワで開催された、GBB 2021 を現地観戦した管理人が、ワルシャワへ行くための情報をまとめたページです。
        </p>
        <p className="mb-8">
          飛行機やホテルの予約から、現地の交通手段まで、GBBに向けた計画を立てるための情報を、GBB 2021 の実例を参考にまとめています。
        </p>

        <PostIt>
          <p>
            当サイトの内容（特に法制度・行政手続き等）については、事前の通告なしに変更される場合もあります。<br />
            渡航前に必ず、渡航先国の在外公館または観光局等で最新情報を確認してください。
          </p>
        </PostIt>

        <h2 className="text-xl font-bold mb-4 mt-18">1. 予約編</h2>
        <p className="mb-4">
          ワルシャワまでの飛行機やホテルの予約を立てるための情報を、GBB 2021 の実例を参考にまとめています。
        </p>
        <div className="flex flex-wrap gap-4 mb-8">
          <LinkCard text="予約編" href={`/${locale}/travel/v1_reservation`} fullWidth />
        </div>

        <h2 className="text-xl font-bold mb-4 mt-18">2. 旅程・荷物編</h2>
        <p className="mb-4">
          ワルシャワでの旅程や、おすすめの持ち物などを、GBB 2021 の実例を参考にまとめています。
        </p>
        <div className="flex flex-wrap gap-4 mb-8">
          <LinkCard text="旅程・荷物編" href={`/${locale}/travel/v1_journey`} fullWidth />
        </div>

        <h2 className="text-xl font-bold mb-4 mt-18">3. 飛行機編</h2>
        <p className="mb-4">
          ワルシャワまでの飛行機の情報を、GBB 2021 の実例を参考にまとめています。
        </p>
        <div className="flex flex-wrap gap-4 mb-8">
          <LinkCard text="飛行機編" href={`/${locale}/travel/v1_flight`} fullWidth />
        </div>

        <h2 className="text-xl font-bold mb-4 mt-18">4. 現地観戦編</h2>
        <p className="mb-4">
          ワルシャワに到着したら、ついに現地観戦です！<br />
          現地観戦のための情報を、GBB 2021 の実例を参考にまとめています。
        </p>
        <div className="flex flex-wrap gap-4 mb-8">
          <LinkCard text="現地観戦計画のたてかた" href={`/${locale}/others/how_to_plan`} fullWidth />
        </div>

        <div className="flex flex-wrap gap-4">
          <LinkCard
            text={
              <span>
                べんりなリンク集
              </span>
            }
            href={`/${locale}/travel/links`}
            fullWidth
          />
        </div>
      </div>
    </main>
  );
};
