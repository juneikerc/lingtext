import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("texts/:id", "routes/texts/text.tsx"),
] satisfies RouteConfig;
