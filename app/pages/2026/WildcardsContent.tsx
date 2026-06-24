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
  { label: "SHOWCASE Solo", playlistId: null },
  { label: "SHOWCASE Loopstation", playlistId: null },
];

const anchorClass =
  "inline-block rounded bg-(--gbb-color) px-4 py-2 text-sm font-bold text-white transition-opacity duration-150 hover:opacity-80";

export const WildcardsContent = ({ locale, year }: WildcardsContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">

        <div className="mb-8 flex flex-wrap gap-4">
          <a href={`/${locale}/${year}/participants`} className={anchorClass}>
            {m.wildcard_result_and_participants({ Wildcard: "Wildcard" })}
          </a>
          <a href={`/${locale}/${year}/rule`} className={anchorClass}>
            {m.rules()} & {m.judges()}
          </a>
        </div>

        <div className="mb-8 rounded bg-(--section-color) px-4 py-8 text-sm text-(--secondary-text-color)">
          <p>{m.wildcard_list({ Wildcard: "Wildcard" })}</p>
          <p className="mt-2">※ 非公式リストです。重複・欠落がある場合があります。</p>
        </div>

        {PLAYLISTS.map(({ label, playlistId }) => (
          <section key={label} className="mb-16">
            <h2 className="mb-4 text-xl font-bold">{label}</h2>
            {playlistId ? (
              <>
                <div className="mb-2">
                  <a
                    href={`https://www.youtube.com/playlist?list=${playlistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={anchorClass}
                  >
                    YouTube
                  </a>
                </div>
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
                    title={`GBB ${year} Wildcard ${label}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
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
