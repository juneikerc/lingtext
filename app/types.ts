import type {
  PhraseEntry as SharedPhraseEntry,
  SpacedRepetitionData as SharedSpacedRepetitionData,
  Translator as SharedTranslator,
  VoiceParams as SharedVoiceParams,
  WordEntry as SharedWordEntry,
} from "@shared/vocabulary";
import { TRANSLATORS as SharedTranslators } from "@shared/vocabulary";

export type AudioRef =
  | { type: "url"; url: string }
  | {
      type: "file";
      name: string; // persisted using FileSystem Access API handle
      fileHandle: FileSystemFileHandle;
    };

export const FOLDER_COLORS = [
  "#6366f1", // indigo
  "#ef4444", // red
  "#22c55e", // green
  "#eab308", // yellow
  "#f97316", // orange
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#a855f7", // purple
] as const;

export type FolderColor = (typeof FOLDER_COLORS)[number];

export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface TextItem {
  id: string;
  title: string;
  content: string;
  format?: "txt" | "markdown"; // Formato del contenido
  createdAt: number;
  audioRef?: AudioRef | null;
  folderId?: string | null;
}

export type SongProvider = "youtube" | "spotify";

export interface SongItem {
  id: string;
  title: string;
  lyrics: string;
  provider: SongProvider;
  sourceUrl: string;
  embedUrl: string;
  createdAt: number;
  updatedAt: number;
}

export interface LanguageIslandItem {
  id: string;
  title: string;
  sentencesText: string;
  createdAt: number;
  updatedAt: number;
}

export type VoiceParams = SharedVoiceParams;

export type SpacedRepetitionData = SharedSpacedRepetitionData;

export type WordEntry = SharedWordEntry;

export type PhraseEntry = SharedPhraseEntry;

export interface Settings {
  id: "preferences";
  tts: Required<Pick<VoiceParams, "lang" | "rate" | "pitch" | "volume">> & {
    voiceName?: string;
  };
  reader: ReaderPreferences;
  review: ReviewPreferences;
}

export interface ReviewPreferences {
  newCardsPerDay: number;
}

export type ReaderTheme = "light" | "sepia";
export type ReaderContentWidth = "narrow" | "normal" | "wide";
export type ReaderFontFamily = "sans" | "serif";
export type ReaderLineHeight = "compact" | "relaxed";
export type ReaderLetterSpacing = "normal" | "spacious";
export type ReaderPreset = "compact" | "comfortable" | "focus" | "custom";

export interface ReaderPreferences {
  theme: ReaderTheme;
  fontSize: number;
  contentWidth: ReaderContentWidth;
  fontFamily: ReaderFontFamily;
  lineHeight: ReaderLineHeight;
  letterSpacing: ReaderLetterSpacing;
  preset: ReaderPreset;
}

export { SharedTranslators as TRANSLATORS };
export type Translator = SharedTranslator;

export interface StoryConfig {
  wordLowerList: string[];
  textType: StoryType;
  customTheme?: string;
  minLength: number;
  level: Level;
  count: 1 | 2 | 3;
}

export type StoryType =
  | "short-story"
  | "article"
  | "conversation"
  | "blog-post"
  | "email";

export type Level = "A2" | "B1" | "B2" | "C1" | "C2";

export interface GeneratedStoryResult {
  title: string;
  content: string;
  wordCount: number;
}

export interface TextCollection {
  title: string;
  level: string;
  content: string;
  sound?: string;
}
