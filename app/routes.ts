import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // public/images に無い画像に対し、明示的に 404 を返す
  // 将来的にR2に接続したら不要になる見込み
  route("/images/*", "routes/images.tsx"),

  // ルートパスでは常に現在の年度のトップページにリダイレクトする
  index("routes/_index.tsx"),

  // 年度共通ルート
  // トップページ
  route("/:lang/:year/top", "routes/common/top.tsx"),
  // 参加者一覧ページ
  route("/:lang/:year/participants", "routes/common/participants.tsx"),
] satisfies RouteConfig;
