import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // ルートパスでは常に現在の年度のトップページにリダイレクトする
  index("routes/_index.tsx"),

  // 年度共通ルート
  // トップページ
  route("/:lang/:year/top", "routes/common/top.tsx"),
  // 参加者一覧ページ
  route("/:lang/:year/participants", "routes/common/participants.tsx"),
] satisfies RouteConfig;
