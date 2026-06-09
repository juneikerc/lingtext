interface CaptionTrack {
  baseUrl?: string;
  languageCode?: string;
  kind?: string;
  vssId?: string;
}

interface PlayerResponse {
  videoDetails?: { videoId?: string };
  captions?: {
    playerCaptionsTracklistRenderer?: { captionTracks?: CaptionTrack[] };
  };
}

function extractTracksFromResponse(response: unknown): {
  videoId?: string;
  tracks: CaptionTrack[];
} {
  const candidate = response as PlayerResponse | undefined;
  const tracks =
    candidate?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

  return {
    videoId: candidate?.videoDetails?.videoId,
    tracks: Array.isArray(tracks) ? tracks : [],
  };
}

function readPlayerResponse(): { videoId?: string; tracks: CaptionTrack[] } {
  const runtime = window as unknown as {
    ytInitialPlayerResponse?: unknown;
    ytplayer?: { config?: { args?: { player_response?: string } } };
  };

  const fromInitial = extractTracksFromResponse(
    runtime.ytInitialPlayerResponse
  );
  if (fromInitial.tracks.length > 0) {
    return fromInitial;
  }

  const rawPlayerResponse = runtime.ytplayer?.config?.args?.player_response;
  if (typeof rawPlayerResponse === "string" && rawPlayerResponse) {
    try {
      return extractTracksFromResponse(JSON.parse(rawPlayerResponse));
    } catch {
      return { tracks: [] };
    }
  }

  return { tracks: [] };
}

window.addEventListener("message", (event) => {
  if (event.source !== window || event.origin !== window.location.origin) {
    return;
  }

  const { type, requestId } = event.data || {};
  if (type !== "LINGTEXT_GET_YOUTUBE_CAPTION_TRACKS") {
    return;
  }

  window.postMessage(
    {
      type: "LINGTEXT_YOUTUBE_CAPTION_TRACKS",
      requestId,
      payload: readPlayerResponse(),
    },
    window.location.origin
  );
});
