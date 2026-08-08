import type { ReactNode } from "react";

type SocialEmbedProps = {
  type: "twitter" | "instagram";
  children: ReactNode;
};

/** SNS埋め込みの枠。スクリプト読込は SocialEmbedLoader.astro 側。 */
export const SocialEmbed = ({ type, children }: SocialEmbedProps) => {
  return (
    <div className="my-8 flex justify-center" data-social-embed={type}>
      {children}
    </div>
  );
};
