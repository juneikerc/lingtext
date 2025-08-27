import React from "react";
import type { SelectionPopupState } from "./types";

interface SelectionPopupProps {
  selPopup: SelectionPopupState;
  onSaveUnknowns: () => void;
  onClose: () => void;
}

export default function SelectionPopup({
  selPopup,
  onSaveUnknowns,
  onClose,
}: SelectionPopupProps) {
  return (
    <div
      className="absolute min-w-[220px] max-w-[320px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 z-30"
      style={{
        left: Math.max(6, selPopup.x - 130),
        top: Math.max(6, selPopup.y - 70),
      }}
    >
      <div className="px-4 py-2 text-sm italic text-gray-700 dark:text-gray-300 truncate">
        "{selPopup.text.slice(0, 80)}"
      </div>
      <div className="px-4 py-2">
        {selPopup.translations.length ? (
          <ul className="list-disc pl-5 space-y-1">
            {selPopup.translations.map((t) => (
              <li key={t.word} className="text-sm">
                <b>{t.word}</b>: {t.translation || "—"}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-400">Sin traducciones locales</div>
        )}
      </div>
      <div className="flex gap-2 flex-wrap justify-end px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <button
          className="px-2 py-0.5 text-xs rounded border border-red-700 text-red-700 dark:border-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition"
          onClick={onSaveUnknowns}
        >
          Guardar como desconocidas
        </button>
        <button
          className="px-2 py-0.5 text-xs rounded border border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
