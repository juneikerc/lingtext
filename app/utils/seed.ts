import { addText, putUnknownWord } from "~/services/db";
import type { AudioRef, TextItem, WordEntry } from "~/types";
import { uid } from "~/utils/id";

const SEED_KEY = "lingtext:seeded:v1";

function makeDefaultWords(): Array<Pick<WordEntry, "word" | "translation">> {
  return [
    { word: "mundane", translation: "mundano" },
    { word: "ache", translation: "dolor" },
    { word: "tilt", translation: "inclinar" },
    { word: "earnest", translation: "serio" },
    { word: "incantation", translation: "encantamiento" },
    { word: "ledger", translation: "libro mayor" },
    { word: "cathedral", translation: "catedral" },
    { word: "cavity", translation: "cavidad" },
    { word: "intricate", translation: "intrincado" },
    { word: "bead", translation: "cuenta (de vidrio)" },
  ];
}

export async function seedInitialDataOnce(): Promise<void> {
  if (typeof window === "undefined") return; // only client
  try {
    if (localStorage.getItem(SEED_KEY)) return;

    // Fetch default text content from public
    const res = await fetch("/the_box_by_the_river.txt");
    if (!res.ok) return; // no seeding if missing
    const content = await res.text();

    const audioRef: AudioRef = {
      type: "url",
      url: "/the_box_by_the_river.mp3",
    };

    const textItem: TextItem = {
      id: uid(),
      title: "The Box by the River",
      content,
      createdAt: Date.now(),
      audioRef,
    };

    await addText(textItem);

    const words = makeDefaultWords();
    for (const w of words) {
      const entry: WordEntry = {
        word: w.word,
        wordLower: w.word.toLowerCase(),
        translation: w.translation,
        status: "unknown",
        addedAt: Date.now(),
      };
      await putUnknownWord(entry);
    }

    localStorage.setItem(SEED_KEY, String(Date.now()));
  } catch (err) {
    console.warn("Seed failed:", err);
  }
}
