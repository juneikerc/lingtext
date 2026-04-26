export interface WordPopupState {
  /** Container-relative x */
  x: number;
  /** Container-relative y */
  y: number;
  /** Viewport-absolute x */
  vx: number;
  /** Viewport-absolute y */
  vy: number;
  word: string;
  lower: string;
  translation: string;
  isLoading?: boolean;
  disclaimer?: string;
}

export interface SelectionPopupState {
  /** Container-relative x */
  x: number;
  /** Container-relative y */
  y: number;
  /** Viewport-absolute x */
  vx: number;
  /** Viewport-absolute y */
  vy: number;
  text: string;
  translation: string;
  isLoading?: boolean;
  disclaimer?: string;
}
