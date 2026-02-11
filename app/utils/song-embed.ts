import type { SongProvider } from "~/types";

interface SongEmbedData {
  provider: SongProvider;
  sourceUrl: string;
  embedUrl: string;
}

type ParseSongEmbedResult = SongEmbedData | { error: string };

function parseUrl(rawUrl: string): URL | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(withProtocol);
  } catch {
    return null;
  }
}

function parseYouTube(url: URL): SongEmbedData | null {
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const pathname = url.pathname;

  const isYouTubeHost =
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com" ||
    host === "youtu.be" ||
    host === "youtube-nocookie.com";
  if (!isYouTubeHost) return null;

  let videoId = "";

  if (host === "youtu.be") {
    videoId = pathname.split("/").filter(Boolean)[0] || "";
  } else if (pathname === "/watch") {
    videoId = url.searchParams.get("v") || "";
  } else if (pathname.startsWith("/shorts/")) {
    videoId = pathname.split("/")[2] || "";
  } else if (pathname.startsWith("/embed/")) {
    videoId = pathname.split("/")[2] || "";
  } else if (pathname.startsWith("/live/")) {
    videoId = pathname.split("/")[2] || "";
  }

  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return null;

  return {
    provider: "youtube",
    sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
  };
}

function parseSpotify(url: URL): SongEmbedData | null {
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host !== "open.spotify.com") return null;

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;

  let type = parts[0];
  let id = parts[1];

  // URLs compartidas de Spotify pueden incluir prefijo regional:
  // /intl-es/track/<id>
  if (type.startsWith("intl-") && parts.length >= 3) {
    type = parts[1];
    id = parts[2];
  }

  // También aceptar URLs ya embebidas:
  // /embed/track/<id>
  if (type === "embed" && parts.length >= 3) {
    type = parts[1];
    id = parts[2];
  }

  const allowedTypes = new Set(["track", "album", "playlist", "episode"]);

  if (!allowedTypes.has(type)) return null;
  if (!/^[A-Za-z0-9]{8,}$/.test(id)) return null;

  return {
    provider: "spotify",
    sourceUrl: `https://open.spotify.com/${type}/${id}`,
    embedUrl: `https://open.spotify.com/embed/${type}/${id}`,
  };
}

export function parseSongEmbed(rawUrl: string): ParseSongEmbedResult {
  const parsedUrl = parseUrl(rawUrl);
  if (!parsedUrl) {
    return { error: "URL inválida. Revisa el enlace e inténtalo otra vez." };
  }

  const youtubeData = parseYouTube(parsedUrl);
  if (youtubeData) return youtubeData;

  const spotifyData = parseSpotify(parsedUrl);
  if (spotifyData) return spotifyData;

  return {
    error:
      "Solo se permiten enlaces válidos de YouTube o Spotify (track, album, playlist o episode).",
  };
}
