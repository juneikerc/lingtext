export type AudioRef =
  | { type: "url"; url: string }
  | {
      type: "file";
      name: string; // persisted using FileSystem Access API handle
      fileHandle: FileSystemFileHandle;
    };

export interface TextItem {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  audioRef?: AudioRef | null;
}

export interface VoiceParams {
  name?: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface SpacedRepetitionData {
  easeFactor: number; // Factor de facilidad (por defecto 2.5)
  interval: number; // Intervalo actual en días
  repetitions: number; // Número de repeticiones exitosas
  nextReview: number; // Timestamp del próximo repaso
  reviewHistory: Array<{
    date: number; // Timestamp de la revisión
    quality: number; // Calidad de la respuesta (0-5, donde 5 es perfecta)
    interval: number; // Intervalo usado en esa revisión
  }>;
}

export interface WordEntry {
  word: string;
  wordLower: string;
  translation: string;
  status: "unknown";
  addedAt: number;
  voice?: VoiceParams;
  // Datos del algoritmo de repetición espaciada
  srData?: SpacedRepetitionData;
}

export interface Settings {
  id: "preferences";
  tts: Required<Pick<VoiceParams, "lang" | "rate" | "pitch" | "volume">> & {
    voiceName?: string;
  };
}

export enum TRANSLATORS {
  CHROME = "chrome",
  GPT_OSS_20B_FREE = "openai/gpt-oss-20b:free",
  GEMMA_3N_E4B_IT_FREE = "google/gemma-3n-e4b-it:free",
}
