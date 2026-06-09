import type { WordPopupState } from "@/types";

interface WordPopupProps {
  popup: WordPopupState;
  isUnknown: boolean;
  onSpeak: (word: string) => void;
  onMarkKnown: (lower: string) => void;
  onMarkUnknown: (lower: string, original: string, translation: string) => void;
  onClose: () => void;
}

function getTranslationInfo(
  translation: string
): Record<string, string[]> | null {
  try {
    const parsed = JSON.parse(translation) as {
      word?: unknown;
      info?: Record<string, string[]>;
    };

    if (parsed && typeof parsed === "object" && parsed.word && parsed.info) {
      return parsed.info;
    }
  } catch {
    return null;
  }

  return null;
}

export default function WordPopup({
  popup,
  isUnknown,
  onSpeak,
  onMarkKnown,
  onMarkUnknown,
  onClose,
}: WordPopupProps) {
  const viewportWidth = window.innerWidth || 1200;
  const viewportHeight = window.innerHeight || 800;
  const popupWidth = Math.min(320, Math.max(260, viewportWidth - 24));
  const popupEstimatedHeight = 320;
  const maxTop = Math.max(12, viewportHeight - popupEstimatedHeight - 12);
  const left = Math.min(
    Math.max(12, popup.x - popupWidth / 2),
    viewportWidth - popupWidth - 12
  );
  const top = Math.min(Math.max(12, popup.y - 80), maxTop);
  const translationInfo = popup.isLoading
    ? null
    : getTranslationInfo(popup.translation);

  return (
    <div
      data-reader-popup="true"
      className="lingtext-reader-popup lingtext-word-popup"
      style={{ left, top, width: popupWidth }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="lingtext-reader-popup-header">
        <div className="lingtext-reader-popup-title-group">
          <div className="lingtext-reader-popup-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="lingtext-reader-popup-title">
            <h3>{popup.word}</h3>
            <p>Palabra seleccionada</p>
          </div>
        </div>
        <div className="lingtext-reader-popup-header-actions">
          <button
            className="lingtext-reader-icon-button"
            onClick={() => onSpeak(popup.word)}
            title="Escuchar"
            aria-label="Escuchar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon
                points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.54 8.46a5 5 0 0 1 0 7.07"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="lingtext-reader-icon-button"
            onClick={onClose}
            title="Cerrar"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M18 6 6 18M6 6l12 12"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="lingtext-reader-section lingtext-reader-section-compact">
        <div className="lingtext-reader-card">
          {popup.isLoading ? (
            <div className="lingtext-reader-loading" role="status">
              <span className="lingtext-reader-loading-spinner" />
              Traduciendo...
            </div>
          ) : translationInfo ? (
            <div className="lingtext-reader-translation-list">
              {Object.entries(translationInfo).map(
                ([category, translations]) => (
                  <div key={category}>
                    <p className="lingtext-reader-category">{category}</p>
                    <p className="lingtext-reader-translation-text">
                      {translations.join(", ")}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            <span className="lingtext-reader-main-translation">
              {popup.translation}
            </span>
          )}
        </div>
      </div>

      <div className="lingtext-reader-section lingtext-reader-status-section">
        <div
          className={`lingtext-reader-status-badge ${isUnknown ? "unknown" : "known"}`}
        >
          <span />
          {isUnknown ? "Por aprender" : "Conocida"}
        </div>
      </div>

      <div className="lingtext-reader-actions">
        {isUnknown ? (
          <button
            className="lingtext-reader-action-button known"
            onClick={() => onMarkKnown(popup.lower)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline
                points="20 6 9 17 4 12"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Marcar como conocida
          </button>
        ) : (
          <button
            className="lingtext-reader-action-button unknown"
            disabled={popup.isLoading}
            onClick={() =>
              onMarkUnknown(popup.lower, popup.word, popup.translation)
            }
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M12 20h9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Marcar para repasar
          </button>
        )}

        <button
          className="lingtext-reader-action-button secondary"
          onClick={() => onSpeak(popup.word)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon
              points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.07 4.93a10 10 0 0 1 0 14.14"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Escuchar de nuevo
        </button>
      </div>
    </div>
  );
}
