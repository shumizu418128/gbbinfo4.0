import { useEffect, type ReactNode } from "react";

type SocialEmbedProps = {
  type: "twitter" | "instagram";
  children: ReactNode;
};

const loadScript = (src: string, id: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });

export const SocialEmbed = ({ type, children }: SocialEmbedProps) => {
  useEffect(() => {
    const processEmbeds = async () => {
      if (type === "twitter") {
        await loadScript("https://platform.twitter.com/widgets.js", "twitter-wjs");
        const twttr = (window as Window & { twttr?: { widgets?: { load: (el?: Element) => void } } }).twttr;
        twttr?.widgets?.load();
        return;
      }
      await loadScript("https://www.instagram.com/embed.js", "instagram-embed-js");
      const instgrm = (window as Window & { instgrm?: { Embeds?: { process: () => void } } }).instgrm;
      instgrm?.Embeds?.process();
    };
    void processEmbeds();
  }, [type]);

  return <div className="my-8 flex justify-center">{children}</div>;
};
