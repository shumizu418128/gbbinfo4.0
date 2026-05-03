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
          <GeneralButton text="test" image="/images/mahiro.webp" href="#" />
          <GeneralButton text="test" image="/images/zenhit.webp" href="#" />
          <GeneralButton text="test" image="/images/scott_jackson.webp" href="#" />
        </div>
        <div className="mb-18 flex flex-wrap gap-4">
          <GeneralButton text="test" image="/images/b4start.webp" href="#" />
          <GeneralButton text="test" image="/images/sorry.webp" href="#" />
          <GeneralButton text="test" image="/images/dice.webp" href="#" />
          <GeneralButton text="test" image="/images/winner.webp" href="#" disabled />
        </div>
      </div>

      <div className="flex justify-center w-full">
        <ul className="w-full max-w-md list-disc text-left px-12 gap-6 mb-32">
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
        <div className="bg-(--section-color) p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-2 text-center">お問い合わせ</h2>
          <hr className="border-(--gbb-color) mb-4" />
          <Table data={[["", "email"], ["チケットに関する問い合わせ先", "gbb@swissbeatbox.com"], ["イベントに関する問い合わせ先", "tickets@weeztix.com"]]} textCenter />
        </div>
      </div>
    </main>
  );
}
