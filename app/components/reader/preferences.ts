import type { CSSProperties } from "react";

import type {
  ReaderContentWidth,
  ReaderFontFamily,
  ReaderLetterSpacing,
  ReaderLineHeight,
  ReaderPreferences,
  ReaderPreset,
  ReaderTheme,
} from "~/types";

type ReaderThemeTokens = {
  pageBg: string;
  surfaceBg: string;
  borderColor: string;
  textColor: string;
  mutedBg: string;
  quoteBg: string;
  linkColor: string;
  accentColor: string;
  tokenHoverBg: string;
  tokenHoverColor: string;
  tooltipBg: string;
  tooltipText: string;
};

const FONT_SIZE_MIN = 15;
const FONT_SIZE_MAX = 24;

const READER_THEME_VALUES: ReaderTheme[] = ["light", "sepia", "dark-soft"];
const READER_WIDTH_VALUES: ReaderContentWidth[] = ["narrow", "normal", "wide"];
const READER_FONT_VALUES: ReaderFontFamily[] = ["sans", "serif"];
const READER_LINE_HEIGHT_VALUES: ReaderLineHeight[] = ["compact", "relaxed"];
const READER_SPACING_VALUES: ReaderLetterSpacing[] = ["normal", "spacious"];

const CONTENT_WIDTH_MAP: Record<ReaderContentWidth, string> = {
  narrow: "42rem",
  normal: "48rem",
  wide: "56rem",
};

const LINE_HEIGHT_MAP: Record<ReaderLineHeight, number> = {
  compact: 1.65,
  relaxed: 1.9,
};

const LETTER_SPACING_MAP: Record<ReaderLetterSpacing, string> = {
  normal: "0em",
  spacious: "0.0125em",
};

const THEME_TOKENS: Record<ReaderTheme, ReaderThemeTokens> = {
  light: {
    pageBg: "#f8fafc",
    surfaceBg: "#ffffff",
    borderColor: "#e5e7eb",
    textColor: "#111827",
    mutedBg: "#f3f4f6",
    quoteBg: "#f9fafb",
    linkColor: "#4f46e5",
    accentColor: "#6366f1",
    tokenHoverBg: "#dbeafe",
    tokenHoverColor: "#1e3a8a",
    tooltipBg: "#1f2937",
    tooltipText: "#f9fafb",
  },
  sepia: {
    pageBg: "#f4ede1",
    surfaceBg: "#fbf5ea",
    borderColor: "#e4d6b8",
    textColor: "#433422",
    mutedBg: "#efe5d2",
    quoteBg: "#f6ecda",
    linkColor: "#9a3412",
    accentColor: "#b45309",
    tokenHoverBg: "#fde7c7",
    tokenHoverColor: "#7c2d12",
    tooltipBg: "#5b4631",
    tooltipText: "#fff7ed",
  },
  "dark-soft": {
    pageBg: "#111827",
    surfaceBg: "#1f2937",
    borderColor: "#374151",
    textColor: "#f3f4f6",
    mutedBg: "#111827",
    quoteBg: "#172033",
    linkColor: "#93c5fd",
    accentColor: "#60a5fa",
    tokenHoverBg: "#1e3a5f",
    tokenHoverColor: "#eff6ff",
    tooltipBg: "#0f172a",
    tooltipText: "#f8fafc",
  },
};

const PRESET_MAP: Record<Exclude<ReaderPreset, "custom">, ReaderPreferences> = {
  compact: {
    theme: "light",
    fontSize: 16,
    contentWidth: "normal",
    fontFamily: "sans",
    lineHeight: "compact",
    letterSpacing: "normal",
    preset: "compact",
  },
  comfortable: {
    theme: "light",
    fontSize: 18,
    contentWidth: "normal",
    fontFamily: "sans",
    lineHeight: "relaxed",
    letterSpacing: "normal",
    preset: "comfortable",
  },
  focus: {
    theme: "sepia",
    fontSize: 20,
    contentWidth: "narrow",
    fontFamily: "serif",
    lineHeight: "relaxed",
    letterSpacing: "spacious",
    preset: "focus",
  },
};

export const DEFAULT_READER_PREFERENCES: ReaderPreferences =
  PRESET_MAP.comfortable;

export const READER_THEME_OPTIONS: Array<{
  value: ReaderTheme;
  label: string;
}> = [
  { value: "light", label: "Claro" },
  { value: "sepia", label: "Sepia" },
  { value: "dark-soft", label: "Noche suave" },
];

export const READER_WIDTH_OPTIONS: Array<{
  value: ReaderContentWidth;
  label: string;
}> = [
  { value: "narrow", label: "Estrecho" },
  { value: "normal", label: "Normal" },
  { value: "wide", label: "Amplio" },
];

export const READER_FONT_OPTIONS: Array<{
  value: ReaderFontFamily;
  label: string;
}> = [
  { value: "sans", label: "Sans" },
  { value: "serif", label: "Serif" },
];

export const READER_LINE_HEIGHT_OPTIONS: Array<{
  value: ReaderLineHeight;
  label: string;
}> = [
  { value: "compact", label: "Compacta" },
  { value: "relaxed", label: "Relajada" },
];

export const READER_SPACING_OPTIONS: Array<{
  value: ReaderLetterSpacing;
  label: string;
}> = [
  { value: "normal", label: "Normal" },
  { value: "spacious", label: "Amplio" },
];

export const READER_PRESET_OPTIONS: Array<{
  value: Exclude<ReaderPreset, "custom">;
  label: string;
}> = [
  { value: "compact", label: "Compacto" },
  { value: "comfortable", label: "Comodo" },
  { value: "focus", label: "Enfoque" },
];

function clampFontSize(value: number): number {
  return Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, Math.round(value)));
}

function isAllowedValue<T extends string>(value: unknown, options: T[]): value is T {
  return typeof value === "string" && options.includes(value as T);
}

export function getPresetPreferences(
  preset: Exclude<ReaderPreset, "custom">
): ReaderPreferences {
  return PRESET_MAP[preset];
}

export function resolveReaderPreferences(
  preferences?: Partial<ReaderPreferences> | null
): ReaderPreferences {
  const basePreset = isAllowedValue(preferences?.preset, [
    "compact",
    "comfortable",
    "focus",
  ])
    ? preferences.preset
    : DEFAULT_READER_PREFERENCES.preset;

  const base = PRESET_MAP[
    basePreset as Exclude<ReaderPreset, "custom">
  ];

  return {
    theme: isAllowedValue(preferences?.theme, READER_THEME_VALUES)
      ? preferences.theme
      : base.theme,
    fontSize:
      typeof preferences?.fontSize === "number"
        ? clampFontSize(preferences.fontSize)
        : base.fontSize,
    contentWidth: isAllowedValue(preferences?.contentWidth, READER_WIDTH_VALUES)
      ? preferences.contentWidth
      : base.contentWidth,
    fontFamily: isAllowedValue(preferences?.fontFamily, READER_FONT_VALUES)
      ? preferences.fontFamily
      : base.fontFamily,
    lineHeight: isAllowedValue(
      preferences?.lineHeight,
      READER_LINE_HEIGHT_VALUES
    )
      ? preferences.lineHeight
      : base.lineHeight,
    letterSpacing: isAllowedValue(
      preferences?.letterSpacing,
      READER_SPACING_VALUES
    )
      ? preferences.letterSpacing
      : base.letterSpacing,
    preset: isAllowedValue(preferences?.preset, [
      "compact",
      "comfortable",
      "focus",
      "custom",
    ])
      ? preferences.preset
      : base.preset,
  };
}

export function getReaderAppearanceStyles(
  preferences: ReaderPreferences,
  compact: boolean
): CSSProperties {
  const theme = THEME_TOKENS[preferences.theme];

  return {
    "--reader-page-bg": theme.pageBg,
    "--reader-surface-bg": theme.surfaceBg,
    "--reader-border-color": theme.borderColor,
    "--reader-text-color": theme.textColor,
    "--reader-muted-bg": theme.mutedBg,
    "--reader-quote-bg": theme.quoteBg,
    "--reader-link-color": theme.linkColor,
    "--reader-accent-color": theme.accentColor,
    "--reader-token-hover-bg": theme.tokenHoverBg,
    "--reader-token-hover-color": theme.tokenHoverColor,
    "--reader-tooltip-bg": theme.tooltipBg,
    "--reader-tooltip-text": theme.tooltipText,
    "--reader-font-size": `${preferences.fontSize}px`,
    "--reader-line-height": String(LINE_HEIGHT_MAP[preferences.lineHeight]),
    "--reader-letter-spacing": LETTER_SPACING_MAP[preferences.letterSpacing],
    "--reader-content-max-width": compact
      ? "100%"
      : CONTENT_WIDTH_MAP[preferences.contentWidth],
    "--reader-font-family":
      preferences.fontFamily === "serif"
        ? '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif'
        : "var(--font-sans)",
  } as CSSProperties;
}
