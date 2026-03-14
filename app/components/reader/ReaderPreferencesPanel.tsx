import { useReaderPreferences } from "./ReaderPreferencesContext";
import {
  READER_FONT_OPTIONS,
  READER_LINE_HEIGHT_OPTIONS,
  READER_PRESET_OPTIONS,
  READER_SPACING_OPTIONS,
  READER_THEME_OPTIONS,
  READER_WIDTH_OPTIONS,
} from "./preferences";

function optionButtonClass(isActive: boolean) {
  return `rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 ${
    isActive
      ? "border-indigo-500 bg-indigo-600 text-white dark:border-indigo-400 dark:bg-indigo-500"
      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
  }`;
}

export default function ReaderPreferencesPanel({
  onClose,
}: {
  onClose: () => void;
}) {
  const { preferences, isReady, applyPreset, updatePreference, resetPreferences } =
    useReaderPreferences();

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/90 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950/40">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Preferencias de lectura
          </h3>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Ajusta el fondo, la tipografia y el ancho del lector.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={resetPreferences}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
            disabled={!isReady}
          >
            Restablecer
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:ring-offset-gray-900"
          >
            <span aria-hidden="true">✕</span>
            <span>Cerrar panel</span>
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Presets
          </span>
          {preferences.preset === "custom" ? (
            <span className="rounded-full bg-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Personalizado
            </span>
          ) : null}
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {READER_PRESET_OPTIONS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              className={optionButtonClass(preferences.preset === preset.value)}
              onClick={() => applyPreset(preset.value)}
              disabled={!isReady}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Tamano de letra
          </label>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              className={optionButtonClass(false)}
              onClick={() =>
                updatePreference("fontSize", Math.max(15, preferences.fontSize - 1))
              }
              aria-label="Reducir tamano de letra"
              disabled={!isReady}
            >
              A-
            </button>
            <input
              type="range"
              min={15}
              max={24}
              step={1}
              value={preferences.fontSize}
              onChange={(event) =>
                updatePreference("fontSize", Number(event.target.value))
              }
              className="h-2 w-full cursor-pointer accent-indigo-600"
              aria-label="Tamano de letra"
              disabled={!isReady}
            />
            <button
              type="button"
              className={optionButtonClass(false)}
              onClick={() =>
                updatePreference("fontSize", Math.min(24, preferences.fontSize + 1))
              }
              aria-label="Aumentar tamano de letra"
              disabled={!isReady}
            >
              A+
            </button>
            <span className="min-w-12 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">
              {preferences.fontSize}px
            </span>
          </div>
        </section>

        <section>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Fondo
          </span>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {READER_THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={optionButtonClass(preferences.theme === option.value)}
                onClick={() => updatePreference("theme", option.value)}
                disabled={!isReady}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Ancho de lectura
          </span>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {READER_WIDTH_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={optionButtonClass(
                  preferences.contentWidth === option.value
                )}
                onClick={() => updatePreference("contentWidth", option.value)}
                disabled={!isReady}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Tipografia
          </span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {READER_FONT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={optionButtonClass(
                  preferences.fontFamily === option.value
                )}
                onClick={() => updatePreference("fontFamily", option.value)}
                disabled={!isReady}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Altura de linea
          </span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {READER_LINE_HEIGHT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={optionButtonClass(
                  preferences.lineHeight === option.value
                )}
                onClick={() => updatePreference("lineHeight", option.value)}
                disabled={!isReady}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Espaciado
          </span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {READER_SPACING_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={optionButtonClass(
                  preferences.letterSpacing === option.value
                )}
                onClick={() => updatePreference("letterSpacing", option.value)}
                disabled={!isReady}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
