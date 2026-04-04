/**
 * Shared extension types for LingText Chrome extension (v2)
 */

import type {
  PhraseEntry as SharedPhraseEntry,
  SyncEnvelope,
  Translator as SharedTranslator,
  WordEntry as SharedWordEntry,
} from "@shared/vocabulary";
import { TRANSLATORS as SharedTranslators } from "@shared/vocabulary";

export { SharedTranslators as TRANSLATORS };
export type Translator = SharedTranslator;

export type WordEntry = SharedWordEntry;

export type PhraseEntry = SharedPhraseEntry;

export interface ExtensionSettings {
  translator: Translator;
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
  schemaVersion?: number;
  words: WordEntry[];
  phrases: PhraseEntry[];
}

export type VersionedSyncPayload = SyncPayload | SyncEnvelope;

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
