import { GeneralButton } from "~/components/GeneralButton";
import { Table } from "~/components/Table";

export const TopContent = () => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-18 flex flex-wrap gap-4">
          <GeneralButton
            text={<span>Wildcard結果<br />出場者</span>}
            image="/images/sora.webp"
            href="/2026/participants"
          />
          <GeneralButton text={<span>ルール<br />審査員</span>} image="/images/mahiro.webp" href="#" />
          <GeneralButton text="タイムテーブル" image="/images/scott_jackson.webp" href="#" disabled />
          <GeneralButton text="日本代表" image="/images/team_japan.webp" href="#" />
        </div>
        <div className="mb-18 flex flex-wrap gap-4">
          <GeneralButton text="辞退者一覧" image="/images/b4start.webp" href="#" />
          <GeneralButton text="会場/チケット" image="/images/dice.webp" href="#" />
          <GeneralButton text="ライブ配信" image="/images/sinjo.webp" href="#" disabled />
          <GeneralButton text="大会結果" image="/images/winner.webp" href="#" disabled />
        </div>
      </div>

      <div className="flex justify-center w-full">
        <ul className="w-full max-w-md list-disc text-left px-12 gap-6 mb-18">
          <li>
            <a
              href="#"
              className="underline transition-colors duration-150 hover:text-(--gbb-color)"
            >
              当サイトURL変更のお知らせ
            </a>
          </li>
          <li>
            <a
              href="#"
              className="underline transition-colors duration-150 hover:text-(--gbb-color)"
            >
              Wildcard結果発表配信
            </a>
          </li>
          <li>
            <a
              href="#"
              className="underline transition-colors duration-150 hover:text-(--gbb-color)"
            >
              Wildcard一覧
            </a>
          </li>
        </ul>
      </div>

      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-18 flex flex-wrap gap-4">
          <GeneralButton text="ポーランドへ行こう" image="/images/zenhit.webp" href="#" />
          <GeneralButton text="7toSmoke" image="/images/afterparty.webp" href="#" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="bg-(--section-color) p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-2 text-center">お問い合わせ</h2>
          <hr className="border-(--gbb-color) mb-4" />
          <Table data={[["", "email"], ["チケットに関する問い合わせ先", "gbb@swissbeatbox.com"], ["イベントに関する問い合わせ先", "tickets@weeztix.com"]]} textCenter />
        </div>
      </div>
    </main>
  );
}
