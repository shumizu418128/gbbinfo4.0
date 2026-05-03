import type { Route } from "./+types/participants.tsx";
import { ParticipantsContent } from "../../2026/ParticipantsContent.js";
import { HeaderMenu } from "../../components/HeaderMenu.js";
import { HeroImage } from "../../components/HeroImage.js";
import { FooterMenu } from "../../components/FooterMenu.js";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GBB 2026 Wildcard結果 & 出場者一覧 - GBB.info" },
    { name: "description", content: "Swissbeatboxが主催するHuman Beatboxの世界大会「Grand Beatbox Battle」の各種情報を、見やすくまとめたサイトです。" },
  ];
}

export const Participants = () => {
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
