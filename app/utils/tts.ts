import type { Settings } from "../types";

export type TTSConfig = Settings["tts"] & { voiceName?: string };

function getVoicesNow(): SpeechSynthesisVoice[] {
  return typeof speechSynthesis !== "undefined"
    ? speechSynthesis.getVoices()
    : [];
}

export function waitForVoices(
  timeoutMs = 1500
): Promise<SpeechSynthesisVoice[]> {
  const existing = getVoicesNow();
  if (existing.length) return Promise.resolve(existing);
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(getVoicesNow()), timeoutMs);
    const handler = () => {
      clearTimeout(timer);
      speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(getVoicesNow());
    };
    speechSynthesis.addEventListener("voiceschanged", handler);
  });
}

export function pickVoice(
  voices: SpeechSynthesisVoice[],
  cfg: TTSConfig
): SpeechSynthesisVoice | undefined {
  if (cfg.voiceName) {
    const byName = voices.find((v) => v.name === cfg.voiceName);
    if (byName) return byName;
  }
  // prefer exact lang match, then startsWith
  const exact = voices.find((v) => v.lang === cfg.lang);
  if (exact) return exact;
  return voices.find((v) =>
    v.lang?.toLowerCase().startsWith(cfg.lang.toLowerCase().split("-")[0])
  );
}

export async function speak(text: string, cfg: TTSConfig): Promise<void> {
  if (!("speechSynthesis" in window)) return;
  const voices = await waitForVoices();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = cfg.rate;
  utter.pitch = cfg.pitch;
  utter.volume = cfg.volume;
  const voice = pickVoice(voices, cfg);
  if (voice) utter.voice = voice;
  return new Promise((resolve) => {
    utter.onend = () => resolve();
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  });
}

export function stop(): void {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
}
