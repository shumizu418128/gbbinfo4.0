import { type RouteConfig, index, route } from "@react-router/dev/routes";

const COMING_SOON = "routes/comingsoon.tsx";

export default [
  // フォントはアプリサーバーから配信
  route("/font/*", "routes/font.tsx"),

  // アプリサーバーへ到達した /images/* を 404 で返す（実体は R2 から取得）
  route("/images/*", "routes/images.tsx"),

  // ルートパスでは常に現在の年度のトップページにリダイレクトする
  index("routes/_index.tsx"),

  // ! MARK: 2026
  route("/:lang/2026/top", "routes/2026/top.tsx"),
  route("/:lang/2026/participants", "routes/2026/participants.tsx"),
  route("/:lang/2026/rule", "routes/2026/rule.tsx"),

  route("/:lang/2026/stream", COMING_SOON),
  route("/:lang/2026/ticket", COMING_SOON),
  route("/:lang/2026/timetable", COMING_SOON),
  route("/:lang/2026/wildcards", COMING_SOON),
  route("/:lang/2026/top_7tosmoke", COMING_SOON),
  route("/:lang/2026/studio_competition", COMING_SOON),

  // ! MARK: 2025
  route("/:lang/2025/top", "routes/2025/top.tsx"),
  route("/:lang/2025/participants", "routes/2025/participants.tsx"),

  route("/:lang/2025/rule", COMING_SOON),
  route("/:lang/2025/ticket", COMING_SOON),
  route("/:lang/2025/timetable", COMING_SOON),
  route("/:lang/2025/wildcards", COMING_SOON),
  route("/:lang/2025/stream", COMING_SOON),
  route("/:lang/2025/top_7tosmoke", COMING_SOON),
  route("/:lang/2025/wildcard_regulation", COMING_SOON),

  // ! MARK: 2024
  route("/:lang/2024/top", COMING_SOON),
  route("/:lang/2024/rule", COMING_SOON),
  route("/:lang/2024/ticket", COMING_SOON),
  route("/:lang/2024/timetable", COMING_SOON),
  route("/:lang/2024/wildcards", COMING_SOON),
  route("/:lang/2024/stream", COMING_SOON),
  route("/:lang/2024/top_7tosmoke", COMING_SOON),

  // ! MARK: 2023
  route("/:lang/2023/top", COMING_SOON),
  route("/:lang/2023/rule", COMING_SOON),
  route("/:lang/2023/ticket", COMING_SOON),
  route("/:lang/2023/timetable", COMING_SOON),
  route("/:lang/2023/wildcards", COMING_SOON),
  route("/:lang/2023/stream", COMING_SOON),
  route("/:lang/2023/top_7tosmoke", COMING_SOON),

  // ! MARK: 2022
  // 中止したのでtopのみ
  route("/:lang/2022/top", COMING_SOON),

  // ! MARK: 2021
  route("/:lang/2021/top", COMING_SOON),
  route("/:lang/2021/timetable", COMING_SOON),
  route("/:lang/2021/ticket", COMING_SOON),
  route("/:lang/2021/rule", COMING_SOON),

  // ! MARK: 2020
  route("/:lang/2020/top", COMING_SOON),
  route("/:lang/2020/ticket", COMING_SOON),
  route("/:lang/2020/rule", COMING_SOON),

  // ! MARK: 2019
  route("/:lang/2019/top", COMING_SOON),
  route("/:lang/2019/ticket", COMING_SOON),
  route("/:lang/2019/rule", COMING_SOON),

  // ! MARK: 2018
  route("/:lang/2018/top", COMING_SOON),
  route("/:lang/2018/ticket", COMING_SOON),
  route("/:lang/2018/rule", COMING_SOON),

  // ! MARK: 2017
  route("/:lang/2017/top", COMING_SOON),
  route("/:lang/2017/ticket", COMING_SOON),
  route("/:lang/2017/rule", COMING_SOON),

  // ! MARK: 2016
  route("/:lang/2016/top", COMING_SOON),

  // ! MARK: 2015
  route("/:lang/2015/top", COMING_SOON),

  // ! MARK: 2014
  route("/:lang/2014/top", COMING_SOON),

  // ! MARK: 2013
  route("/:lang/2013/top", COMING_SOON),

] satisfies RouteConfig;
