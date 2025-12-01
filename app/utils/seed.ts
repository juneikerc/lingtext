import { addText, putUnknownWord, getAllTexts } from "~/services/db";
import type { AudioRef, TextItem, WordEntry } from "~/types";
import { uid } from "~/utils/id";

const SEED_KEY = "lingtext:seeded:v2"; // Bumped version for SQLite migration

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
    // Check if we already seeded AND if data actually exists
    const alreadySeeded = localStorage.getItem(SEED_KEY);
    if (alreadySeeded) {
      // Verify data actually exists (in case DB was reset)
      const existingTexts = await getAllTexts();
      if (existingTexts.length > 0) {
        return; // Data exists, no need to seed
      }
      // Data was lost, clear the flag and re-seed
      console.log("[Seed] Data was lost, re-seeding...");
      localStorage.removeItem(SEED_KEY);
    }

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
