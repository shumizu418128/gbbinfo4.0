import type { Route } from "../2026/+types/participants.js";
import { ParticipantsContent } from "../../2026/ParticipantsContent.js";
import { HeaderMenu } from "../../components/HeaderMenu.js";
import { HeroImage } from "../../components/HeroImage.js";
import { FooterMenu } from "../../components/FooterMenu.js";
import { useLoaderData } from "react-router";
import { requireLocale } from "../../util/locale.js";
import { setLocale } from "../../../paraglide/runtime.js";

export function loader({ params }: Route.LoaderArgs) {
  const locale = requireLocale(params.lang);
  return locale;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GBB 2026 Wildcard結果 & 出場者一覧 - GBBinfo" },
    { name: "description", content: "Swissbeatboxが主催するHuman Beatboxの世界大会「Grand Beatbox Battle」の各種情報を、見やすくまとめたサイトです。" },
  ];
}

export const Participants = () => {
  const locale = useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <HeaderMenu />
      <HeroImage year={2026} />
      <ParticipantsContent />
      <FooterMenu />
    </>
  );
}

export default Participants;
