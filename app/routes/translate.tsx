import type { Route } from "./+types/translate";

// That is a "endpoint" Resource Route that returns the text to translate as a response without any html

export function loader({ params }: Route.LoaderArgs) {
  const { text } = params;

  return new Response(text, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
