import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("/2026/top", "routes/2026/top.tsx"),
  route("/2026/participants", "routes/2026/participants.tsx"),
] satisfies RouteConfig;
