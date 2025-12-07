/**
 * Tipos compartidos para la extensión LingText
 * Espejo de app/types.ts de la web app principal
 */

export interface WordEntry {
  word: string;
  wordLower: string;
  translation: string;
  status: "unknown";
  addedAt: number;
  voice?: VoiceParams;
  srData?: SpacedRepetitionData;
}

export interface PhraseEntry {
  phrase: string;
  phraseLower: string;
  translation: string;
  parts: string[];
  addedAt: number;
  srData?: SpacedRepetitionData;
}

export interface VoiceParams {
  name?: string;
  lang: string;
  rate: number;
  pitch: number;
  volume: number;
}

export interface SpacedRepetitionData {
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: number;
  lastReview: number;
}

export interface Settings {
  id: string;
  tts: VoiceParams;
}

// Mensajes entre content script y background
export type ExtensionMessage =
  | { type: "GET_WORDS" }
  | { type: "GET_PHRASES" }
  | { type: "GET_SETTINGS" }
  | { type: "PUT_WORD"; payload: WordEntry }
  | { type: "DELETE_WORD"; payload: string }
  | { type: "PUT_PHRASE"; payload: PhraseEntry }
  | {
      type: "SYNC_FROM_WEB";
      payload: { words: WordEntry[]; phrases: PhraseEntry[] };
    }
  | { type: "EXPORT_FOR_WEB" };

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
