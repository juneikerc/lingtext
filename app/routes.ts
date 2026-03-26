import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("texts/:id", "routes/texts/text.tsx"),
  route("words", "routes/words.tsx"),
  route("review", "routes/review.tsx"),
  route("contacto", "routes/contact.tsx"),
  route("levels/:level", "routes/levels/level.tsx"),
  route("textos-en-ingles", "routes/english-texts.tsx"),
  route("blog", "routes/blog/blogPage.tsx"),
  route("blog/:slug", "routes/blog/blog.tsx"),
  route("legal/:slug", "routes/legal/legal-page.tsx"),
  route("comunidad", "routes/community.tsx"),
  route("1000-frases-en-ingles", "routes/english-phrases.tsx"),
  route("500-palabras-en-ingles", "routes/english-words-500.tsx"),
  route("aprender-ingles-con-canciones", "routes/songs/songs.tsx"),
  route("aprender-ingles-con-canciones/:id", "routes/songs/song.tsx"),
  route("aprender-con-language-island", "routes/language-island/islands.tsx"),
  route(
    "aprender-con-language-island/:id",
    "routes/language-island/island.tsx"
  ),
  route("my-library", "routes/my-library.tsx"),
] satisfies RouteConfig;
