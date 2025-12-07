/**
 * SelectionPopup - Popup para frases seleccionadas
 */

interface SelectionPopupProps {
  popup: {
    x: number;
    y: number;
    text: string;
    translation: string;
  };
  onSave: (text: string, translation: string) => void;
  onClose: () => void;
}

export default function SelectionPopup({
  popup,
  onSave,
  onClose,
}: SelectionPopupProps) {
  // Detectar si la traducción es JSON estructurado
  const isJsonTranslation = popup.translation.startsWith("{");
  let displayTranslation = popup.translation;

  if (isJsonTranslation) {
    try {
      const parsed = JSON.parse(popup.translation);
      if (parsed.info) {
        displayTranslation = Object.entries(parsed.info)
          .map(([cat, vals]) => `${cat}: ${(vals as string[]).join(", ")}`)
          .join("\n");
      }
    } catch {
      // No es JSON válido
    }
  }

  return (
    <div
      className="lingtext-selection-popup"
      style={{
        left: popup.x,
        top: popup.y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="lingtext-selection-header">
        <span className="lingtext-selection-text">"{popup.text}"</span>
        <button className="lingtext-popup-close" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Traducción */}
      <div className="lingtext-selection-translation">
        <div className="lingtext-popup-label">🇪🇸 Traducción</div>
        <div className="lingtext-translation-content">{displayTranslation}</div>
      </div>

      {/* Acciones */}
      <div className="lingtext-selection-actions">
        <button
          className="lingtext-btn lingtext-btn-save"
          onClick={() => onSave(popup.text, popup.translation)}
        >
          💾 Guardar frase
        </button>
      </div>
    </div>
  );
}
