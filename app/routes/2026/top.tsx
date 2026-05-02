import type { Route } from "./+types/top.tsx";
import { TopContent } from "../../2026/top.js";
import { HeaderMenu } from "../../components/HeaderMenu.js";
import { HeroImage } from "../../components/HeroImage.js";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GBB 2026 - GBB.info" },
    { name: "description", content: "Swissbeatboxが主催するHuman Beatboxの世界大会「Grand Beatbox Battle」の各種情報を、見やすくまとめたサイトです。" },
  ];
}

export const Top = () => {
  return (
    <>
      <HeaderMenu />
      <HeroImage title="GBB 2026" subtitle="WE LOVE BEATBOX" />
      <TopContent />
    </>
  );
}

export default Top;
