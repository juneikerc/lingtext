import React from "react";
import { Link } from "react-router";
import type { WordEntry } from "~/types";
import { exportUnknownWordsCsv } from "~/utils/anki";
import { deleteWord, getSettings } from "~/db";
import { speak } from "~/utils/tts";

interface UnknownWordsSectionProps {
  words: WordEntry[];
  onRemove: (wordLower: string) => void;
}

export default function UnknownWordsSection({ words, onRemove }: UnknownWordsSectionProps) {
  return (
    <section className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <Link to="/" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2">
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path fill="#057fa8" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path>
              <path
                fill="#057fa8"
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
              ></path>
            </g>
          </svg>
          Back
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Palabras desconocidas</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {words.length} {words.length === 1 ? "palabra" : "palabras"}
          </span>
          <button
            type="button"
            onClick={() => exportUnknownWordsCsv()}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 21H4a1 1 0 01-1-1v-3a0 0 0 000 0h0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Exportar CSV
          </button>
        </div>
      </div>

      {words.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">
          <p className="mb-1 font-medium">No hay palabras desconocidas.</p>
          <p className="text-sm">Lee un texto y marca palabras como desconocidas para verlas aquí.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Palabra</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Traducción</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {words.map((word) => (
                <tr key={word.wordLower} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {word.word}{" "}
                    <button
                      onClick={async () => {
                        const settings = await getSettings();
                        await speak(word.word, settings.tts);
                      }}
                      className="ml-2 rounded p-1 text-indigo-600 hover:bg-indigo-50"
                      title={`Reproducir ${word.word}`}
                      aria-label={`Reproducir ${word.word}`}
                    >
                      🔊
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{word.translation}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {word.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      title={`Eliminar ${word.word}`}
                      aria-label={`Eliminar ${word.word}`}
                      className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-sm font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      onClick={async () => {
                        const ok = confirm(`¿Eliminar "${word.word}"?`);
                        if (!ok) return;
                        await deleteWord(word.wordLower);
                        onRemove(word.wordLower);
                      }}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M3 6.52381C3 6.12932 3.32671 5.80952 3.72973 5.80952H8.51787C8.52437 4.9683 8.61554 3.81504 9.45037 3.01668C10.1074 2.38839 11.0081 2 12 2C12.9919 2 13.8926 2.38839 14.5496 3.01668C15.3844 3.81504 15.4756 4.9683 15.4821 5.80952H20.2703C20.6733 5.80952 21 6.12932 21 6.52381C21 6.9183 20.6733 7.2381 20.2703 7.2381H3.72973C3.32671 7.2381 3 6.9183 3 6.52381Z" fill="#d31717"></path>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.5956 22H12.4044C15.1871 22 16.5785 22 17.4831 21.1141C18.3878 20.2281 18.4803 18.7749 18.6654 15.8685L18.9321 11.6806C19.0326 10.1036 19.0828 9.31511 18.6289 8.81545C18.1751 8.31579 17.4087 8.31579 15.876 8.31579H8.12404C6.59127 8.31579 5.82488 8.31579 5.37105 8.81545C4.91722 9.31511 4.96744 10.1036 5.06788 11.6806L5.33459 15.8685C5.5197 18.7749 5.61225 20.2281 6.51689 21.1141C7.42153 22 8.81289 22 11.5956 22ZM10.2463 12.1885C10.2051 11.7546 9.83753 11.4381 9.42537 11.4815C9.01321 11.5249 8.71251 11.9117 8.75372 12.3456L9.25372 17.6087C9.29494 18.0426 9.66247 18.3591 10.0746 18.3157C10.4868 18.2724 10.7875 17.8855 10.7463 17.4516L10.2463 12.1885ZM14.5746 11.4815C14.9868 11.5249 15.2875 11.9117 15.2463 12.3456L14.7463 17.6087C14.7051 18.0426 14.3375 18.3591 13.9254 18.3157C13.5132 18.2724 13.2125 17.8855 13.2537 17.4516L13.7537 12.1885C13.7949 11.7546 14.1625 11.4381 14.5746 11.4815Z"
                            fill="#d31717"
                          ></path>
                        </g>
                      </svg>
                      <span>Eliminar</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
