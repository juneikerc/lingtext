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
  format?: "txt" | "markdown"; // Formato del contenido
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
  // Flag opcional para indicar que este item representa una frase en el UI de repaso
  isPhrase?: boolean;
}

// Nueva entidad para frases compuestas
export interface PhraseEntry {
  // Frase original tal como la seleccionó el usuario
  phrase: string;
  // Clave normalizada en minúsculas sin puntuación, separada por espacios
  phraseLower: string;
  // Traducción de la frase
  translation: string;
  // Partes (palabras) normalizadas que componen la frase, en orden
  parts: string[];
  // Fecha en la que se añadió
  addedAt: number;
  // Datos del algoritmo de repetición espaciada para frases
  srData?: SpacedRepetitionData;
}

export interface Settings {
  id: "preferences";
  tts: Required<Pick<VoiceParams, "lang" | "rate" | "pitch" | "volume">> & {
    voiceName?: string;
  };
}

/**
 * Tiered Translation Models
 * All models run 100% locally in the browser (except CHROME_AI which uses native API)
 */
export enum TRANSLATORS {
  // TIER 0: Native Chrome API (No download required)
  CHROME_AI = "chrome_ai",

  // TIER 1: CPU - Low-end / Maximum Compatibility (~400MB)
  CPU_QWEN_05 = "cpu_qwen_05",

  // TIER 2: GPU Balanced - Medium (Recommended) (~1.1GB download, ~1.8GB VRAM)
  GPU_QWEN_15 = "gpu_qwen_15",

  // TIER 3: GPU Powerful - High-end (~5GB download, ~6GB VRAM)
  GPU_LLAMA_3 = "gpu_llama_3",

  // TIER 4: GPU Maximum - Experimental/Enthusiast (~6GB download, ~8GB VRAM)
  GPU_GEMMA_2 = "gpu_gemma_2",
}

/**
 * Model metadata for UI display and hardware requirements
 */
export interface ModelInfo {
  id: TRANSLATORS;
  name: string;
  description: string;
  tier: 0 | 1 | 2 | 3 | 4;
  downloadSize: string;
  vramRequired: string | null;
  requiresGPU: boolean;
  modelHfId: string | null;
  recommended?: boolean;
  disabled?: boolean;
}

export const MODEL_INFO: Record<TRANSLATORS, ModelInfo> = {
  [TRANSLATORS.CHROME_AI]: {
    id: TRANSLATORS.CHROME_AI,
    name: "Chrome AI",
    description: "Traducción nativa del navegador. Sin descarga.",
    tier: 0,
    downloadSize: "0 MB",
    vramRequired: null,
    requiresGPU: false,
    modelHfId: null,
  },
  [TRANSLATORS.CPU_QWEN_05]: {
    id: TRANSLATORS.CPU_QWEN_05,
    name: "CPU (No disponible)",
    description: "Temporalmente deshabilitado por incompatibilidad con Vite.",
    tier: 1,
    downloadSize: "N/A",
    vramRequired: null,
    requiresGPU: false,
    modelHfId: null,
    disabled: true, // Mark as disabled
  },
  [TRANSLATORS.GPU_QWEN_15]: {
    id: TRANSLATORS.GPU_QWEN_15,
    name: "Qwen 1.5B (GPU)",
    description: "Balance perfecto entre velocidad y calidad.",
    tier: 2,
    downloadSize: "~1.1 GB",
    vramRequired: "~1.8 GB",
    requiresGPU: true,
    modelHfId: "mlc-ai/Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
    recommended: true,
  },
  [TRANSLATORS.GPU_LLAMA_3]: {
    id: TRANSLATORS.GPU_LLAMA_3,
    name: "Llama 3.1 8B (GPU)",
    description: "Alta calidad. Requiere GPU potente.",
    tier: 3,
    downloadSize: "~5.0 GB",
    vramRequired: "~6 GB",
    requiresGPU: true,
    modelHfId: "mlc-ai/Llama-3.1-8B-Instruct-q4f16_1-MLC",
  },
  [TRANSLATORS.GPU_GEMMA_2]: {
    id: TRANSLATORS.GPU_GEMMA_2,
    name: "Gemma 2 9B (GPU)",
    description: "Máxima calidad. Solo para entusiastas.",
    tier: 4,
    downloadSize: "~6.0 GB",
    vramRequired: "~8 GB",
    requiresGPU: true,
    modelHfId: "mlc-ai/gemma-2-9b-it-q4f16_1-MLC",
  },
};

/**
 * Translation engine status
 */
export type TranslationStatus =
  | "idle"
  | "downloading"
  | "ready"
  | "computing"
  | "error";

/**
 * Translation result with structured info
 */
export interface TranslationResult {
  word: string;
  info: Record<string, string[]>;
  raw?: string;
}
