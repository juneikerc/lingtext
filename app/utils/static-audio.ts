export type StaticAudioCollection =
  | "english-phrases"
  | "english-words-500"
  | "vocabulary";

let currentAudio: HTMLAudioElement | null = null;

function slugifyAudioText(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 72)
    .replace(/-+$/g, "");

  return slug || "audio";
}

function hashText(value: string): string {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }

  return hash.toString(36).padStart(7, "0");
}

export function getStaticAudioUrl(
  collection: StaticAudioCollection,
  text: string
): string {
  const normalizedText = text.trim();
  return `/audio/data/${collection}/${slugifyAudioText(normalizedText)}-${hashText(
    normalizedText
  )}.mp3`;
}

export async function playStaticAudio(src: string): Promise<void> {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audio = new Audio(src);
  currentAudio = audio;

  return new Promise((resolve, reject) => {
    audio.addEventListener("ended", () => resolve(), { once: true });
    audio.addEventListener(
      "error",
      () => reject(new Error(`Could not play audio: ${src}`)),
      { once: true }
    );

    audio.play().catch(reject);
  });
}
