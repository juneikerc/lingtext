export function getCurrentVideoId(): string | null {
  if (window.location.pathname !== "/watch") {
    return null;
  }

  return new URLSearchParams(window.location.search).get("v");
}

export function watchVideoId(onChange: (videoId: string | null) => void): () => void {
  let current = getCurrentVideoId();
  onChange(current);

  const tick = () => {
    const next = getCurrentVideoId();
    if (next === current) {
      return;
    }

    current = next;
    onChange(next);
  };

  const intervalId = window.setInterval(tick, 300);
  window.addEventListener("popstate", tick);
  window.addEventListener("yt-navigate-finish", tick as EventListener);

  return () => {
    window.clearInterval(intervalId);
    window.removeEventListener("popstate", tick);
    window.removeEventListener("yt-navigate-finish", tick as EventListener);
  };
}

export function watchPlayerRect(
  onRect: (rect: DOMRect | null) => void
): () => void {
  let rafId: number | null = null;
  let lastRect: { left: number; top: number; width: number; height: number } | null =
    null;

  const update = () => {
    if (rafId !== null) {
      return;
    }

    rafId = requestAnimationFrame(() => {
      rafId = null;

      const player = document.querySelector<HTMLElement>("#movie_player");
      if (!player) {
        lastRect = null;
        onRect(null);
        return;
      }

      const rect = player.getBoundingClientRect();
      const nextRect = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };

      if (
        lastRect &&
        nextRect.left === lastRect.left &&
        nextRect.top === lastRect.top &&
        nextRect.width === lastRect.width &&
        nextRect.height === lastRect.height
      ) {
        return;
      }

      lastRect = nextRect;
      onRect(rect);
    });
  };

  const observer = new MutationObserver(update);
  const moviePlayer = document.querySelector("#movie_player");
  if (moviePlayer) {
    observer.observe(moviePlayer, { childList: true, subtree: true });
  }

  window.addEventListener("resize", update);
  window.addEventListener("scroll", update, true);
  update();

  return () => {
    observer.disconnect();
    window.removeEventListener("resize", update);
    window.removeEventListener("scroll", update, true);

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  };
}
