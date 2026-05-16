import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("/:lang/:year/top", "routes/common/top.tsx"),
  route("/:lang/:year/participants", "routes/common/participants.tsx"),
] satisfies RouteConfig;
