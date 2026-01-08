import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("texts/:id", "routes/texts/text.tsx"),
  route("words", "routes/words.tsx"),
  route("review", "routes/review.tsx"),
  route("contacto", "routes/contact.tsx"),
  route("levels/:level", "routes/levels/level.tsx"),
  route("blog", "routes/blog/blogPage.tsx"),
  route("blog/:slug", "routes/blog/blog.tsx"),
  route("comunidad", "routes/community.tsx"),
] satisfies RouteConfig;
