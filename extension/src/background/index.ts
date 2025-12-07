/**
 * Background Service Worker
 * Maneja la comunicación entre content scripts y la base de datos
 */

import {
  getAllWords,
  putWord,
  deleteWord,
  getAllPhrases,
  putPhrase,
  getSettings,
  importFromWeb,
  exportForWeb,
} from "./db";
import type { ExtensionMessage } from "@/types";

// Escuchar mensajes de content scripts
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse) => {
    handleMessage(message).then(sendResponse);
    return true; // Indica que la respuesta será asíncrona
  }
);

async function handleMessage(message: ExtensionMessage): Promise<unknown> {
  switch (message.type) {
    case "GET_WORDS":
      return getAllWords();

    case "GET_PHRASES":
      return getAllPhrases();

    case "GET_SETTINGS":
      return getSettings();

    case "PUT_WORD":
      await putWord(message.payload);
      return { success: true };

    case "DELETE_WORD":
      await deleteWord(message.payload);
      return { success: true };

    case "PUT_PHRASE":
      await putPhrase(message.payload);
      return { success: true };

    case "SYNC_FROM_WEB":
      await importFromWeb(message.payload);
      return { success: true };

    case "EXPORT_FOR_WEB":
      return exportForWeb();

    default:
      return { error: "Unknown message type" };
  }
}

// Escuchar conexiones externas (desde lingtext.org)
chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    // Verificar que viene de lingtext.org o localhost
    const origin = sender.origin || "";
    if (!origin.includes("lingtext.org") && !origin.includes("localhost")) {
      sendResponse({ error: "Unauthorized origin" });
      return;
    }

    handleMessage(message as ExtensionMessage).then(sendResponse);
    return true;
  }
);

console.log("[LingText Extension] Background worker initialized");
