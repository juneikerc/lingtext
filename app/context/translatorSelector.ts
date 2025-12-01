import { create } from "zustand";
import { TRANSLATORS } from "../types";
import type { TranslationStatus } from "../types";

// Storage key for persistence
const STORAGE_KEY = "lingtext_preferred_model";

/**
 * Get initial model from localStorage or default
 */
function getInitialModel(): TRANSLATORS {
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && Object.values(TRANSLATORS).includes(saved as TRANSLATORS)) {
      return saved as TRANSLATORS;
    }
  }
  return TRANSLATORS.CHROME_AI;
}

interface TranslatorSelectorState {
  // Selected model
  selected: TRANSLATORS;
  setSelected: (selected: TRANSLATORS) => void;

  // Engine status
  status: TranslationStatus;
  setStatus: (status: TranslationStatus) => void;

  // Download progress (0-100)
  downloadProgress: number;
  setDownloadProgress: (progress: number) => void;

  // Progress text message
  progressText: string;
  setProgressText: (text: string) => void;

  // Model ready state
  modelReady: boolean;
  setModelReady: (ready: boolean) => void;

  // Hardware capabilities
  hasGPU: boolean;
  setHasGPU: (hasGPU: boolean) => void;
  hasChromeAI: boolean;
  setHasChromeAI: (hasChromeAI: boolean) => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;

  // Reset state
  reset: () => void;
}

export const useTranslatorStore = create<TranslatorSelectorState>()((set) => ({
  selected: getInitialModel(),
  setSelected: (selected) => {
    // Persist to localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, selected);
    }
    set({
      selected,
      // Reset model state when changing
      modelReady: selected === TRANSLATORS.CHROME_AI,
      status: selected === TRANSLATORS.CHROME_AI ? "ready" : "idle",
      downloadProgress: 0,
      progressText: "",
      error: null,
    });
  },

  status: "idle",
  setStatus: (status) => set({ status }),

  downloadProgress: 0,
  setDownloadProgress: (downloadProgress) => set({ downloadProgress }),

  progressText: "",
  setProgressText: (progressText) => set({ progressText }),

  modelReady: false,
  setModelReady: (modelReady) => set({ modelReady }),

  hasGPU: false,
  setHasGPU: (hasGPU) => set({ hasGPU }),

  hasChromeAI: false,
  setHasChromeAI: (hasChromeAI) => set({ hasChromeAI }),

  error: null,
  setError: (error) => set({ error }),

  reset: () =>
    set({
      status: "idle",
      downloadProgress: 0,
      progressText: "",
      modelReady: false,
      error: null,
    }),
}));
