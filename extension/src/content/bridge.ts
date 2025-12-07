/**
 * Bridge Content Script
 * Se inyecta en lingtext.org/localhost para sincronizar datos
 * entre la web app y la extensión
 */

import type { WordEntry, PhraseEntry } from "@/types";

// Escuchar mensajes de la web app
window.addEventListener("message", async (event) => {
  // Verificar origen
  if (
    !event.origin.includes("lingtext.org") &&
    !event.origin.includes("localhost")
  ) {
    return;
  }

  const { type, payload } = event.data || {};

  switch (type) {
    case "LINGTEXT_SYNC_REQUEST": {
      // La web app solicita sincronización
      // Enviar datos de la extensión a la web
      const data = await chrome.runtime.sendMessage({ type: "EXPORT_FOR_WEB" });
      window.postMessage(
        { type: "LINGTEXT_SYNC_RESPONSE", payload: data },
        event.origin
      );
      break;
    }

    case "LINGTEXT_IMPORT_TO_EXTENSION": {
      // La web app envía datos para importar en la extensión
      const { words, phrases } = payload as {
        words: WordEntry[];
        phrases: PhraseEntry[];
      };
      await chrome.runtime.sendMessage({
        type: "SYNC_FROM_WEB",
        payload: { words, phrases },
      });
      window.postMessage(
        { type: "LINGTEXT_IMPORT_COMPLETE", payload: { success: true } },
        event.origin
      );
      break;
    }
  }
});

// Notificar a la web app que la extensión está instalada
window.postMessage({ type: "LINGTEXT_EXTENSION_READY" }, "*");

console.log("[LingText Bridge] Content script initialized");
