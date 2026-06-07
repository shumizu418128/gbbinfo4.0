import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // public/images に無い画像に対し、明示的に 404 を返す
  // 将来的にR2に接続したら不要になる見込み
  route("/images/*", "routes/images.tsx"),

  // ルートパスでは常に現在の年度のトップページにリダイレクトする
  index("routes/_index.tsx"),

  // 2026
  route("/:lang/2026/top", "routes/2026/top.tsx"),
  route("/:lang/2026/participants", "routes/2026/participants.tsx"),
  route("/:lang/2026/rule", "routes/2026/rule.tsx"),

  // 2025
  route("/:lang/2025/top", "routes/2025/top.tsx"),
  route("/:lang/2025/participants", "routes/2025/participants.tsx"),
] satisfies RouteConfig;
