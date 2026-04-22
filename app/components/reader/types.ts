export interface WordPopupState {
  x: number;
  y: number;
  word: string;
  lower: string;
  translation: string;
  isLoading?: boolean;
  disclaimer?: string;
}

export interface SelectionPopupState {
  x: number;
  y: number;
  text: string;
  translation: string;
  isLoading?: boolean;
  disclaimer?: string;
}
