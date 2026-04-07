import type { Route } from "./+types/my-library";
import Library from "~/components/Libary";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Mi Biblioteca | LingText" },
    {
      name: "description",
      content:
        "Agrega, edita y organiza tus propios textos para aprender inglés con lectura inmersiva en LingText.",
    },
    {
      name: "robots",
      content: "noindex",
    },
  ];
}

export const links: Route.LinksFunction = () => [
  {
    rel: "canonical",
    href: "https://lingtext.org/my-library",
  },
];

export default function MyLibrary() {
  return <Library />;
}
