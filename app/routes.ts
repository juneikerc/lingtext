import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("texts/:id", "routes/texts/text.tsx"),
  route("words", "routes/words.tsx"),
  route("translate/:text", "routes/translate.tsx"),
  route("review", "routes/review.tsx"),
] satisfies RouteConfig;
