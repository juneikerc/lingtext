import { create } from "zustand";
import { TRANSLATORS } from "../types";

interface TranslatorSelectorState {
  selected: TRANSLATORS;
  setSelected: (selected: TRANSLATORS) => void;
}

export const useTranslatorStore = create<TranslatorSelectorState>()((set) => ({
  selected: TRANSLATORS.CHROME,
  setSelected: (selected) => set((state) => ({ selected })),
}));
