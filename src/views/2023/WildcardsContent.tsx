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
};

type DeadlineGroup = {
  deadline: string;
  playlists: PlaylistItem[];
};

const buildDeadlineGroups = (): DeadlineGroup[] => [
  {
    deadline: "2/5",
    playlists: [
      {
        label: `${LOOPSTATION} ${m.wildcard_2023_round1()}`,
        playlistId: "PL-lF9xAI7Ut0qVQxqcolridFy6fxq9mzf",
      },
      {
        label: `${SOLO} ${m.wildcard_2023_round1()}`,
        playlistId: "PL-lF9xAI7Ut3r03svs85h1EpBFe6FdH-h",
      },
      {
        label: "U18",
        playlistId: "PL-lF9xAI7Ut2HN_eKAIoxKKFknbmyvucm",
      },
    ],
  },
  {
    deadline: "2/12",
    playlists: [
      {
        label: `${PRODUCER} showcase`,
        playlistId: "PL-lF9xAI7Ut2ANtv6g6g_2ZIjIWGUBg0M",
      },
      {
        label: TAG_TEAM,
        playlistId: "PL-lF9xAI7Ut2d77cAztu76PkcjIBRxFTW",
      },
    ],
  },
  {
    deadline: "2/19",
    playlists: [
      {
        label: CREW,
        playlistId: "PL-lF9xAI7Ut0A2C0T1-hTYr_igjaJkVSk",
      },
    ],
  },
  {
    deadline: "3/16",
    playlists: [
      {
        label: `${LOOPSTATION} ${m.wildcard_2023_round2()}`,
        playlistId: "PL-lF9xAI7Ut2t2B-_zjCW-nz7ifEPNKRx",
      },
    ],
  },
  {
    deadline: "3/17",
    playlists: [
      {
        label: `${SOLO} ${m.wildcard_2023_round2()}`,
        playlistId: "PL-lF9xAI7Ut1S8hLs1-rYzmNV2OT8ivG-",
      },
    ],
  },
];

const PlaylistSection = ({
  label,
  playlistId,
  year,
}: PlaylistItem & { year: number }) => (
  <section className="mb-8">
    <h3 className="mb-4 text-lg font-bold">{label}</h3>
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
);

export const WildcardsContent = ({ locale, year }: WildcardsContentProps) => {
  const teamHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const teamLabel = locale === "ko" ? m.team_korea() : m.team_japan();
  const deadlineGroups = buildDeadlineGroups();
  const bonusPlaylist = {
    label: m.wildcard_2023_loop_jp_r1({
      Loopstation: LOOPSTATION,
      Wildcard: WILDCARD,
    }),
    playlistId: "PL-lF9xAI7Ut2SSafxbZBriwO-kIZFlxgL",
  };

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className="mb-8 text-(--secondary-text-color)">
          {m.wildcard_2023_jst_note()}
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

        {deadlineGroups.map(({ deadline, playlists }) => (
          <section key={deadline} className="mb-16">
            <h2 className="mb-8 text-xl font-bold">
              {m.wildcard_list_deadline({ date: deadline })}
            </h2>
            {playlists.map((playlist) => (
              <PlaylistSection key={playlist.playlistId} {...playlist} year={year} />
            ))}
          </section>
        ))}

        <section className="mb-16">
          <h2 className="mb-8 text-xl font-bold">{m.wildcard_2023_bonus()}</h2>
          <PlaylistSection {...bonusPlaylist} year={year} />
        </section>

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
