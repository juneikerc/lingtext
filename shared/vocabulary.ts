export interface VoiceParams {
  name?: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface SpacedRepetitionData {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  reviewHistory: Array<{
    date: number;
    quality: number;
    interval: number;
  }>;
}

export type SyncPeer = "web" | "extension";

export interface SyncFieldClock {
  updatedAt: number;
  updatedBy: SyncPeer;
}

export interface BaseSyncMetadata<Field extends string> {
  schemaVersion: number;
  revision: number;
  updatedAt: number;
  updatedBy: SyncPeer;
  fields: Partial<Record<Field, SyncFieldClock>>;
}

export type WordSyncField =
  | "word"
  | "wordLower"
  | "translation"
  | "status"
  | "addedAt"
  | "voice"
  | "srData";

export type PhraseSyncField =
  | "phrase"
  | "phraseLower"
  | "translation"
  | "parts"
  | "addedAt"
  | "srData";

export interface WordEntry {
  word: string;
  wordLower: string;
  translation: string;
  status: "unknown";
  addedAt: number;
  updatedAt?: number;
  voice?: VoiceParams;
  srData?: SpacedRepetitionData;
  isPhrase?: boolean;
  sync?: BaseSyncMetadata<WordSyncField>;
}

export interface PhraseEntry {
  phrase: string;
  phraseLower: string;
  translation: string;
  parts: string[];
  addedAt: number;
  updatedAt?: number;
  srData?: SpacedRepetitionData;
  sync?: BaseSyncMetadata<PhraseSyncField>;
}

export enum TRANSLATORS {
  CHROME = "chrome",
  MYMEMORY = "mymemory",
  MEDIUM = "google/gemini-2.5-flash-lite",
  SMART = "google/gemini-3.1-flash-lite-preview",
}

export type Translator = TRANSLATORS;

export interface SyncEnvelope {
  schemaVersion: number;
  source: SyncPeer;
  exportedAt: number;
  words: WordEntry[];
  phrases: PhraseEntry[];
}

export interface SyncMergeResult {
  words: WordEntry[];
  phrases: PhraseEntry[];
}
