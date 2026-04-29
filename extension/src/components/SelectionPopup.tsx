interface SelectionPopupProps {
  popup: {
    x: number;
    y: number;
    text: string;
    translation: string;
  };
  onSpeak: (text: string) => void;
  onSave: (text: string, translation: string) => void;
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

export default function SelectionPopup({
  popup,
  onSpeak,
  onSave,
  onClose,
}: SelectionPopupProps) {
  const viewportWidth = window.innerWidth || 1200;
  const viewportHeight = window.innerHeight || 800;
  const popupWidth = Math.min(400, Math.max(280, viewportWidth - 24));
  const popupEstimatedHeight = 260;
  const maxTop = Math.max(12, viewportHeight - popupEstimatedHeight - 12);
  const left = Math.min(
    Math.max(12, popup.x - popupWidth / 2),
    viewportWidth - popupWidth - 12
  );
  const top = Math.min(Math.max(12, popup.y - 100), maxTop);
  const translationInfo = getTranslationInfo(popup.translation);
  const selectedText =
    popup.text.length > 100 ? `${popup.text.substring(0, 100)}...` : popup.text;

  return (
    <div
      data-reader-popup="true"
      className="lingtext-reader-popup lingtext-selection-popup"
      style={{ left, top, width: popupWidth }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="lingtext-reader-popup-header">
        <div className="lingtext-reader-popup-title-group compact">
          <div className="lingtext-reader-popup-icon small" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="lingtext-reader-selection-title">
            Texto seleccionado
          </span>
        </div>
        <div className="lingtext-reader-popup-header-actions">
          <button
            className="lingtext-reader-icon-button"
            onClick={() => onSpeak(popup.text)}
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

      <div className="lingtext-reader-section no-bottom-padding">
        <div className="lingtext-reader-card selected-text">
          <p>&ldquo;{selectedText}&rdquo;</p>
        </div>
      </div>

      <div className="lingtext-reader-section">
        <div className="lingtext-reader-card accent">
          {translationInfo ? (
            <div className="lingtext-reader-translation-list">
              {Object.entries(translationInfo).map(
                ([category, translations]) => (
                  <div key={category}>
                    <p className="lingtext-reader-category accent">
                      {category}
                    </p>
                    <p className="lingtext-reader-translation-text">
                      {translations.join(", ")}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            <span className="lingtext-reader-selection-translation">
              {popup.translation}
            </span>
          )}
        </div>
      </div>

      <div className="lingtext-reader-actions with-border">
        <button
          className="lingtext-reader-action-button known"
          onClick={() => onSave(popup.text, popup.translation)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline
              points="20 6 9 17 4 12"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Guardar frase
        </button>

        <button
          className="lingtext-reader-action-button secondary"
          onClick={() => onSpeak(popup.text)}
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
          Escuchar
        </button>
      </div>
    </div>
  );
}
