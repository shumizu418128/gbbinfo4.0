import { LinkCard } from "~/components/LinkCard.js";
import { PostIt } from "~/components/PostIt.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import {
  CREW,
  LOOPSTATION,
  PRODUCER,
  SOLO,
  TAG_TEAM,
  WILDCARD,
  YOUTUBE,
} from "~/constants/i18nTerms.js";
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
    label: LOOPSTATION,
    playlistId: "PL-lF9xAI7Ut0yUF8WY5IuX6o4xRKyMBAC",
    deadline: "3/22",
  },
  {
    label: SOLO,
    playlistId: "PL-lF9xAI7Ut1qGFSr93tDkjt3bADme5YG",
    deadline: "3/22",
  },
  {
    label: PRODUCER,
    playlistId: "PL-lF9xAI7Ut0elAJ0t6yb6K1gxs5eTEZO",
    deadline: "3/29",
  },
  {
    label: TAG_TEAM,
    playlistId: "PL-lF9xAI7Ut2lTXuqCIDXYT7noqSEHMfn",
    deadline: "4/5",
  },
  {
    label: CREW,
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
          {m.wildcard_list_cet_note()}
        </p>

        <div className="mb-16 flex flex-wrap gap-4">
          <LinkCard
            text={
              <span>
                {m.wildcard_result({ Wildcard: WILDCARD })}
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
                {m.wildcard_list_deadline({ date: deadline })}
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
              text={YOUTUBE}
              href={`https://www.youtube.com/playlist?list=${playlistId}`}
              fullWidth
            />
          </section>
        ))}

        <PostIt>
          <p className="mb-4">{m.wildcard_unofficial_notice()}</p>
          <p className="mb-4">
            {m.wildcard_list_unofficial_intro({ Wildcard: WILDCARD })}
            <a
              href="https://twitter.com/_NURUYU_"
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-1 ${anchorClass}`}
            >
              {m.wildcard_list_creator()}
            </a>
          </p>
          <p className="mb-4">{m.wildcard_list_manual_warning()}</p>
          <p>{m.wildcard_list_video_warning({ Wildcard: WILDCARD })}</p>
        </PostIt>

        <div className="mt-16 flex flex-wrap gap-4">
          <LinkCard
            text={m.how_to_plan()}
            image="/images/zenhit.webp"
            href={`/${locale}/others/how_to_plan`}
          />
          <LinkCard text={teamLabel} image="/images/team_japan.webp" href={teamHref} />
        </div>
      </div>
    </main>
  );
};
