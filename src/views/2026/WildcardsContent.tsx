import { LinkCard } from "~/components/LinkCard.js";
import { PostIt } from "~/components/PostIt.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import {
  CREW,
  GBB,
  LOOPSTATION,
  PRODUCER,
  SHOWCASE,
  SOLO,
  TAG_TEAM,
  WILDCARD,
  YOUTUBE,
} from "~/constants/i18nTerms.js";
import * as m from "../../../paraglide/messages.js";

type WildcardsContentProps = {
  locale: SupportedLanguage;
  year: number;
};

type PlaylistItem = {
  label: string;
  playlistId: string | null;
};

const PLAYLISTS: PlaylistItem[] = [
  { label: LOOPSTATION, playlistId: "PL-lF9xAI7Ut1QGCCS8RGq5Qpy1DKEIqaA" },
  { label: SOLO, playlistId: "PL-lF9xAI7Ut1UO2wAl3nuz3gofCgIhSFo" },
  { label: TAG_TEAM, playlistId: "PL-lF9xAI7Ut1RbqqhzK5P5NQJ1sbzEGP1" },
  { label: CREW, playlistId: "PL-lF9xAI7Ut2Rf9UDK0mvntazS6HKPSHQ" },
  { label: `${SHOWCASE} ${PRODUCER}`, playlistId: "PL-lF9xAI7Ut0x8q022VmszOlNItRhgRnl" },
];

export const WildcardsContent = ({ locale, year }: WildcardsContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">

        <PostIt>
          <p>{m.wildcard_unofficial_notice()}</p>
        </PostIt>

        {PLAYLISTS.map(({ label, playlistId }) => (
          <section key={label} className="mb-16">
            <h2 className="mb-4 text-xl font-bold">{label}</h2>
            {playlistId ? (
              <>
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
                    title={`${GBB} ${year} ${WILDCARD} ${label}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="mb-2">
                  <LinkCard
                    text={YOUTUBE}
                    href={`https://www.youtube.com/playlist?list=${playlistId}`}
                    fullWidth
                  />
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-(--secondary-text-color)">
                coming soon...
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
};
