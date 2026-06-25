import { type RouteConfig, index, route } from "@react-router/dev/routes";

const COMING_SOON = "routes/comingsoon.tsx";

/** 同一モジュールを複数 URL に割り当てるため、ルーター内部 ID のみユニーク化する */
const comingSoon = (path: string) =>
  route(path, COMING_SOON, {
    id: `comingsoon/${path.slice(1).replace(/:/g, "")}`,
  });

export default [
  // アプリサーバーへ到達した /images/* を 404 で返す（実体は R2 から取得）
  route("/images/*", "routes/images.tsx"),

  // ルートパスでは常に現在の年度のトップページにリダイレクトする
  index("routes/_index.tsx"),

  // ! MARK: - participants
  // route("/:lang/participants/team/:id", "routes/participants/team.tsx"),
  // route("/:lang/participants/single/:id", "routes/participants/single.tsx"),
  // route("/:lang/participants/member/:id", "routes/participants/member.tsx"),
  comingSoon("/:lang/participants/team/:id"),
  comingSoon("/:lang/participants/single/:id"),
  comingSoon("/:lang/participants/member/:id"),

  // ! MARK: - 2026
  route("/:lang/2026/top", "routes/2026/top.tsx"),
  route("/:lang/2026/participants", "routes/2026/participants.tsx"),
  route("/:lang/2026/rule", "routes/2026/rule.tsx"),
  route("/:lang/2026/cancel", "routes/2026/cancel.tsx"),
  route("/:lang/2026/japan", "routes/2026/japan.tsx"),
  route("/:lang/2026/korea", "routes/2026/korea.tsx"),
  route("/:lang/2026/stream", "routes/2026/stream.tsx"),
  route("/:lang/2026/ticket", "routes/2026/ticket.tsx"),
  route("/:lang/2026/timetable", "routes/2026/timetable.tsx"),
  route("/:lang/2026/wildcards", "routes/2026/wildcards.tsx"),
  route("/:lang/2026/top_7tosmoke", "routes/2026/top_7tosmoke.tsx"),
  route("/:lang/2026/studio_competition", "routes/2026/studio_competition.tsx"),

  // ! MARK: - 2025
  route("/:lang/2025/top", "routes/2025/top.tsx"),
  route("/:lang/2025/participants", "routes/2025/participants.tsx"),

  comingSoon("/:lang/2025/cancel"),
  comingSoon("/:lang/2025/japan"),
  comingSoon("/:lang/2025/korea"),
  comingSoon("/:lang/2025/rule"),
  comingSoon("/:lang/2025/ticket"),
  comingSoon("/:lang/2025/timetable"),
  comingSoon("/:lang/2025/wildcards"),
  comingSoon("/:lang/2025/stream"),
  comingSoon("/:lang/2025/top_7tosmoke"),
  comingSoon("/:lang/2025/wildcard_regulation"),

  // ! MARK: - 2024
  comingSoon("/:lang/2024/participants"),
  comingSoon("/:lang/2024/cancel"),
  comingSoon("/:lang/2024/japan"),
  comingSoon("/:lang/2024/korea"),
  comingSoon("/:lang/2024/top"),
  comingSoon("/:lang/2024/rule"),
  comingSoon("/:lang/2024/ticket"),
  comingSoon("/:lang/2024/timetable"),
  comingSoon("/:lang/2024/wildcards"),
  comingSoon("/:lang/2024/stream"),
  comingSoon("/:lang/2024/top_7tosmoke"),

  // ! MARK: - 2023
  comingSoon("/:lang/2023/participants"),
  comingSoon("/:lang/2023/cancel"),
  comingSoon("/:lang/2023/japan"),
  comingSoon("/:lang/2023/korea"),
  comingSoon("/:lang/2023/top"),
  comingSoon("/:lang/2023/rule"),
  comingSoon("/:lang/2023/ticket"),
  comingSoon("/:lang/2023/timetable"),
  comingSoon("/:lang/2023/wildcards"),
  comingSoon("/:lang/2023/stream"),
  comingSoon("/:lang/2023/top_7tosmoke"),

  // 2022
  // 中止したのでtopのみ
  comingSoon("/:lang/2022/top"),

  // 2021
  comingSoon("/:lang/2021/participants"),
  comingSoon("/:lang/2021/cancel"),
  comingSoon("/:lang/2021/japan"),
  comingSoon("/:lang/2021/korea"),
  comingSoon("/:lang/2021/top"),
  comingSoon("/:lang/2021/timetable"),
  comingSoon("/:lang/2021/ticket"),
  comingSoon("/:lang/2021/rule"),

  // 2020
  comingSoon("/:lang/2020/participants"),
  comingSoon("/:lang/2020/cancel"),
  comingSoon("/:lang/2020/japan"),
  comingSoon("/:lang/2020/korea"),
  comingSoon("/:lang/2020/top"),
  comingSoon("/:lang/2020/ticket"),
  comingSoon("/:lang/2020/rule"),

  // 2019
  comingSoon("/:lang/2019/participants"),
  comingSoon("/:lang/2019/cancel"),
  comingSoon("/:lang/2019/japan"),
  comingSoon("/:lang/2019/korea"),
  comingSoon("/:lang/2019/top"),
  comingSoon("/:lang/2019/ticket"),
  comingSoon("/:lang/2019/rule"),

  // 2018
  comingSoon("/:lang/2018/participants"),
  comingSoon("/:lang/2018/cancel"),
  comingSoon("/:lang/2018/japan"),
  comingSoon("/:lang/2018/korea"),
  comingSoon("/:lang/2018/top"),
  comingSoon("/:lang/2018/ticket"),
  comingSoon("/:lang/2018/rule"),

  // 2017
  comingSoon("/:lang/2017/participants"),
  comingSoon("/:lang/2017/cancel"),
  comingSoon("/:lang/2017/japan"),
  comingSoon("/:lang/2017/korea"),
  comingSoon("/:lang/2017/top"),
  comingSoon("/:lang/2017/ticket"),
  comingSoon("/:lang/2017/rule"),

  // 2016
  comingSoon("/:lang/2016/participants"),
  comingSoon("/:lang/2016/cancel"),
  comingSoon("/:lang/2016/japan"),
  comingSoon("/:lang/2016/korea"),
  comingSoon("/:lang/2016/top"),

  // 2015
  comingSoon("/:lang/2015/participants"),
  comingSoon("/:lang/2015/cancel"),
  comingSoon("/:lang/2015/japan"),
  comingSoon("/:lang/2015/korea"),
  comingSoon("/:lang/2015/top"),

  // 2014
  comingSoon("/:lang/2014/participants"),
  comingSoon("/:lang/2014/cancel"),
  comingSoon("/:lang/2014/japan"),
  comingSoon("/:lang/2014/korea"),
  comingSoon("/:lang/2014/top"),

  // 2013
  comingSoon("/:lang/2013/participants"),
  comingSoon("/:lang/2013/cancel"),
  comingSoon("/:lang/2013/japan"),
  comingSoon("/:lang/2013/korea"),
  comingSoon("/:lang/2013/top"),

  // ! MARK: - others
  comingSoon("/:lang/others/about"),
  comingSoon("/:lang/others/7tosmoke"),
  comingSoon("/:lang/others/how_to_plan"),
  comingSoon("/:lang/others/past_info"),
  comingSoon("/:lang/others/result_stream"),
  comingSoon("/:lang/others/translation"),
  comingSoon("/:lang/others/url_change"),

  // ! MARK: - travel
  route("/:lang/travel/top", "routes/travel/top.tsx"),
  route("/:lang/travel/links", "routes/travel/links.tsx"),
  route("/:lang/travel/v1_flight", "routes/travel/v1_flight.tsx"),
  route("/:lang/travel/v1_journey", "routes/travel/v1_journey.tsx"),
  route("/:lang/travel/v1_reservation", "routes/travel/v1_reservation.tsx"),

] satisfies RouteConfig;
