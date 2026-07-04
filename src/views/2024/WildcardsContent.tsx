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

const WILDCARD = "Wildcard";

const PLAYLISTS: PlaylistItem[] = [
  {
    label: "Loopstation",
    playlistId: "PL-lF9xAI7Ut2XJG1NJsLUQOzh8_AEzOUa",
    deadline: "3/9",
  },
  {
    label: "Solo",
    playlistId: "PL-lF9xAI7Ut2B8PYTyW0iL1cawUGjU5HM",
    deadline: "3/9",
  },
  {
    label: "Producer",
    playlistId: "PL-lF9xAI7Ut2ABvVNW4mjY0rjh9cJjVkZ",
    deadline: "3/23",
  },
  {
    label: "Tag Team",
    playlistId: "PL-lF9xAI7Ut3xPq-4aeO5AFGFWVxA_qFb",
    deadline: "3/23",
  },
  {
    label: "Crew",
    playlistId: "PL-lF9xAI7Ut1oxto8A5r1Ld4wJttKA9N0",
    deadline: "3/23",
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
              text="YouTube"
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
