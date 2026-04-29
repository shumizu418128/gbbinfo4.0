import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { HeaderMenu } from "../components/HeaderMenu";
import { HeroImage } from "../components/HeroImage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <HeaderMenu />
      <HeroImage title="GBB 2026" subtitle="Wildcard結果 & 出場者一覧" />
      <Welcome />
    </>
  );
}
