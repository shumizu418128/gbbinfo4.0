import { LinkCard } from "~/components/LinkCard.js";
import { PostIt } from "~/components/PostIt.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { anchorClass } from "~/constants/linkStyle.js";
import * as m from "../../../paraglide/messages.js";

type WildcardsContentProps = {
  locale: SupportedLanguage;
  year: number;
};

type PlaylistItem = {
  label: string;
  playlistId: string;
  deadline: string;
};

const PLAYLISTS: PlaylistItem[] = [
  {
    label: "Loopstation",
    playlistId: "PL-lF9xAI7Ut0yUF8WY5IuX6o4xRKyMBAC",
    deadline: "3/22",
  },
  {
    label: "Solo",
    playlistId: "PL-lF9xAI7Ut1qGFSr93tDkjt3bADme5YG",
    deadline: "3/22",
  },
  {
    label: "Producer",
    playlistId: "PL-lF9xAI7Ut0elAJ0t6yb6K1gxs5eTEZO",
    deadline: "3/29",
  },
  {
    label: "Tag Team",
    playlistId: "PL-lF9xAI7Ut2lTXuqCIDXYT7noqSEHMfn",
    deadline: "4/5",
  },
  {
    label: "Crew",
    playlistId: "PL-lF9xAI7Ut0zfjRaQ3Sd7X-dqdu7IEg2",
    deadline: "4/5",
  },
];

export const WildcardsContent = ({ locale, year }: WildcardsContentProps) => {
  const teamHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const teamLabel = locale === "ko" ? m.team_korea() : m.team_japan();

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className="mb-8 text-(--secondary-text-color)">
          各部門の締め切り期日は、中央ヨーロッパ時刻を基準に表記しています。
        </p>

        <div className="mb-16 flex flex-wrap gap-4">
          <LinkCard
            text={
              <span>
                {m.wildcard_result({ Wildcard: "Wildcard" })}
                <br />
                {m.participants()}
              </span>
            }
            image="/images/sora.webp"
            href={`/${locale}/${year}/participants`}
          />
          <LinkCard
            text={<span>{m.rules()}<br />{m.judges()}</span>}
            image="/images/mahiro.webp"
            href={`/${locale}/${year}/rule`}
          />
        </div>

        {PLAYLISTS.map(({ label, playlistId, deadline }) => (
          <section key={label} className="mb-16">
            <h2 className="mb-4 text-xl font-bold">
              {label}
              <span className="ml-2 text-base font-normal text-(--secondary-text-color)">
                ({deadline} 締め切り)
              </span>
            </h2>
            <div className="relative mb-4 w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
                title={`GBB ${year} Wildcard ${label}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <LinkCard
              text="YouTube"
              href={`https://www.youtube.com/playlist?list=${playlistId}`}
              fullWidth
            />
          </section>
        ))}

        <PostIt>
          <p className="mb-4">{m.wildcard_unofficial_notice()}</p>
          <p className="mb-4">
            今回公開するWildcard一覧は、有志が作成した、非公式のものです。
            <a
              href="https://twitter.com/_NURUYU_"
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-1 ${anchorClass}`}
            >
              作成者：ぬる湯さん
            </a>
          </p>
          <p className="mb-4">
            すべて手作業で制作されたものであるため、重複や欠落がある可能性があります。
          </p>
          <p>
            また、この再生リストにある動画が必ずしもWildcardとして申請された動画であるとは限りません（毎年必ず出場者の手続きミスで失格者が出ます）。
          </p>
        </PostIt>

        <div className="mt-16 flex flex-wrap gap-4">
          <LinkCard
            text="現地観戦計画のたてかた"
            image="/images/zenhit.webp"
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard text={teamLabel} image="/images/team_japan.webp" href={teamHref} />
        </div>
      </div>
    </main>
  );
};
