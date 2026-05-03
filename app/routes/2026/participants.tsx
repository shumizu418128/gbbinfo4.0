import type { Route } from "./+types/participants.tsx";
import { ParticipantsContent } from "../../2026/ParticipantsContent.js";
import { HeaderMenu } from "../../components/HeaderMenu.js";
import { HeroImage } from "../../components/HeroImage.js";
import { FooterMenu } from "../../components/FooterMenu.js";
import { useLoaderData } from "react-router";
import { requireAndSetLocale } from "../../util/locale";
import { setLocale } from "../../../paraglide/runtime";

export function loader({ params }: Route.LoaderArgs) {
  const locale = requireAndSetLocale(params.lang);
  return locale;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GBB 2026 Wildcard結果 & 出場者一覧 - GBB.info" },
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
