export interface WordPopupState {
  x: number;
  y: number;
  word: string;
  lower: string;
  translation: string;
}

export interface SelectionPopupState {
  x: number;
  y: number;
  text: string;
  lowers: string[];
  translations: Array<{ word: string; translation: string }>;
}
