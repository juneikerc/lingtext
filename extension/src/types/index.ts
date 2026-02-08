/**
 * Shared extension types for LingText Chrome extension (v2)
 */

export enum TRANSLATORS {
  CHROME = "chrome",
  MEDIUM = "google/gemini-2.5-flash-lite",
  SMART = "google/gemini-3-flash-preview",
}

export interface WordEntry {
  word: string;
  wordLower: string;
  translation: string;
  status: "unknown";
  addedAt: number;
}

export interface PhraseEntry {
  phrase: string;
  phraseLower: string;
  translation: string;
  parts: string[];
  addedAt: number;
}

export interface ExtensionSettings {
  translator: TRANSLATORS;
  apiKey: string;
  captionLanguage: "en";
  hideNativeCc: boolean;
}

export interface WordPopupState {
  x: number;
  y: number;
  word: string;
  lower: string;
  translation: string;
}

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

export interface SyncPayload {
  words: WordEntry[];
  phrases: PhraseEntry[];
}

export type ExtensionMessage =
  | { type: "LT2_GET_WORDS" }
  | { type: "LT2_GET_WORD"; payload: string }
  | { type: "LT2_PUT_WORD"; payload: WordEntry }
  | { type: "LT2_DELETE_WORD"; payload: string }
  | { type: "LT2_GET_PHRASES" }
  | { type: "LT2_PUT_PHRASE"; payload: PhraseEntry }
  | { type: "LT2_EXPORT_SYNC" }
  | { type: "LT2_IMPORT_SYNC"; payload: SyncPayload }
  | { type: "LT2_GET_SETTINGS" }
  | {
      type: "LT2_SET_SETTINGS";
      payload: Partial<ExtensionSettings>;
    };
