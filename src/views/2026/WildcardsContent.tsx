import { LinkCard } from "~/components/LinkCard.js";
import { PostIt } from "~/components/PostIt.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
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
  { label: "Loopstation", playlistId: "PL-lF9xAI7Ut1QGCCS8RGq5Qpy1DKEIqaA" },
  { label: "Solo", playlistId: "PL-lF9xAI7Ut1UO2wAl3nuz3gofCgIhSFo" },
  { label: "Tag Team", playlistId: "PL-lF9xAI7Ut1RbqqhzK5P5NQJ1sbzEGP1" },
  { label: "Crew", playlistId: "PL-lF9xAI7Ut2Rf9UDK0mvntazS6HKPSHQ" },
  { label: "SHOWCASE Producer", playlistId: "PL-lF9xAI7Ut0x8q022VmszOlNItRhgRnl" },
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
                    title={`GBB ${year} Wildcard ${label}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="mb-2">
                  <LinkCard
                    text="YouTube"
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
