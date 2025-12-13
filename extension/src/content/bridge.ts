/**
 * Bridge Content Script
 * Se inyecta en lingtext.org/localhost para sincronizar datos
 * entre la web app y la extensión
 *
 * Flujo de sincronización (Web como fuente de verdad):
 * 1. Extensión envía sus datos a la web
 * 2. Web hace merge (newer wins) y guarda
 * 3. Web devuelve estado completo + API key
 * 4. Extensión reemplaza su caché con los datos de la web
 */

import type { WordEntry, PhraseEntry } from "@/types";

interface SyncData {
  words: WordEntry[];
  phrases: PhraseEntry[];
  apiKey?: string;
  translator?: string;
}

function isAllowedOrigin(origin: string): boolean {
  if (!origin || origin === "null") return false;
  try {
    const { hostname } = new URL(origin);
    return (
      hostname === "localhost" ||
      hostname === "lingtext.org" ||
      hostname.endsWith(".lingtext.org")
    );
  } catch {
    return false;
  }
}

const PAGE_ORIGIN = window.location.origin;

// Escuchar mensajes de la web app
window.addEventListener("message", async (event) => {
  // Verificar origen
  if (event.source !== window) {
    return;
  }

  if (!isAllowedOrigin(event.origin)) {
    return;
  }

  const { type, payload } = event.data || {};

  switch (type) {
    case "LINGTEXT_SYNC_REQUEST": {
      // La web app solicita los datos de la extensión para hacer merge
      const data = await chrome.runtime.sendMessage({ type: "EXPORT_FOR_WEB" });
      window.postMessage(
        { type: "LINGTEXT_SYNC_RESPONSE", payload: data },
        event.origin
      );
      break;
    }

    case "LINGTEXT_SYNC_COMPLETE": {
      // La web app envía el estado final después del merge
      // La extensión reemplaza completamente su caché
      const { words, phrases, apiKey, translator } = payload as SyncData;

      await chrome.runtime.sendMessage({
        type: "REPLACE_ALL_DATA",
        payload: { words, phrases },
      });

      // Guardar API key y traductor si vienen de la web
      if (apiKey) {
        await chrome.storage.local.set({ openrouter_key: apiKey });
      }
      if (translator) {
        await chrome.storage.local.set({ translator });
      }

      // Guardar timestamp de última sincronización
      await chrome.storage.local.set({ lastSync: Date.now() });

      window.postMessage(
        { type: "LINGTEXT_EXTENSION_SYNCED", payload: { success: true } },
        event.origin
      );
      console.log("[LingText Bridge] Sync complete - data replaced from web");
      break;
    }

    // Legacy: mantener compatibilidad con el flujo anterior
    case "LINGTEXT_IMPORT_TO_EXTENSION": {
      const { words, phrases } = payload as SyncData;
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

// Escuchar mensajes del popup para iniciar sincronización manual
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "TRIGGER_SYNC") {
    // Enviar solicitud de sincronización a la web app
    window.postMessage(
      { type: "LINGTEXT_EXTENSION_SYNC_REQUEST" },
      PAGE_ORIGIN
    );
    sendResponse({ triggered: true });
  }
  return true;
});

// Notificar a la web app que la extensión está instalada
window.postMessage({ type: "LINGTEXT_EXTENSION_READY" }, PAGE_ORIGIN);

console.log("[LingText Bridge] Content script initialized");
