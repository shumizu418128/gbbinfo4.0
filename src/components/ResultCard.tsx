import { Flag } from "~/components/Flag.js";
import { ParticipantAvatar } from "~/components/ParticipantAvatar.js";
import { anchorClass } from "~/constants/linkStyle.js";
import type { CountryDisplayInfo } from "~/util/country.js";

type ResultCardPerson = {
  name: string;
  href?: string;
  countries: CountryDisplayInfo[];
};

type ResultCardProps = {
  winner: ResultCardPerson & { imageUrl?: string };
  loser: ResultCardPerson;
};

/**
 * 名前行（国旗 + 名前）。href があるときは ParticipantCard と同じリンクスタイル。
 */
const NameRow = ({
  name,
  href,
  countries,
  className = "",
}: ResultCardPerson & { className?: string }) => {
  const content = (
    <>
      {countries.map((country) => (
        <Flag key={country.isoCode} isoAlpha2={country.isoAlpha2} />
      ))}
      <span className="min-w-0 wrap-break-word">{name.toUpperCase()}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`inline-flex max-w-full items-center gap-2 ${anchorClass} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      className={`inline-flex max-w-full items-center gap-2 text-(--gbb-color) underline ${className}`}
    >
      {content}
    </span>
  );
};

/**
 * トーナメント1試合分の結果カード。
 *
 * アバター付きの勝者行の下に、インデントした vs / 敗者をずらして表示する。
 * 国旗と名前のみ（ticketClass 等は出さない）。
 */
export const ResultCard = ({ winner, loser }: ResultCardProps) => (
  <div
    className="relative mx-auto w-full max-w-lg px-1 py-2"
    style={{ backgroundColor: "var(--section-color)" }}
  >
    <div className="flex min-w-0 gap-2">
      <ParticipantAvatar name={winner.name} imageUrl={winner.imageUrl} />
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-xl">
          WIN
          <br />
          <NameRow
            name={winner.name}
            href={winner.href}
            countries={winner.countries}
          />
        </div>
        <div className="pt-2 pl-4 text-(--secondary-text-color)">vs</div>
        <div className="pt-2 pl-8">
          <NameRow
            name={loser.name}
            href={loser.href}
            countries={loser.countries}
          />
        </div>
      </div>
    </div>
  </div>
);
