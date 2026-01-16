import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { TRANSLATORS } from "../types";
import { isChromeAIAvailable } from "../utils/translate";

interface TranslatorSelectorState {
  selected: TRANSLATORS;
  setSelected: (selected: TRANSLATORS) => void;
}

function getDefaultTranslator(): TRANSLATORS {
  if (typeof window === "undefined") return TRANSLATORS.CHROME;
  return isChromeAIAvailable() ? TRANSLATORS.CHROME : TRANSLATORS.MYMEMORY;
}

const storage =
  typeof window === "undefined"
    ? {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }
    : createJSONStorage(() => window.localStorage);

export const useTranslatorStore = create<TranslatorSelectorState>()(
  persist(
    (set) => ({
      selected: getDefaultTranslator(),
      setSelected: (selected) => set({ selected }),
    }),
    {
      name: "lingtext.translator",
      storage,
      partialize: (state) => ({ selected: state.selected }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<TranslatorSelectorState>;
        const selected = state?.selected;
        const allowed = new Set(Object.values(TRANSLATORS));
        if (!selected || !allowed.has(selected)) {
          return { selected: getDefaultTranslator() };
        }
        return { selected };
      },
    }
  )
);
