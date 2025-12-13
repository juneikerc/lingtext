/**
 * Background Service Worker
 * Maneja la comunicación entre content scripts y la base de datos
 */

import {
  getAllWords,
  getWord,
  putWord,
  deleteWord,
  getAllPhrases,
  putPhrase,
  getSettings,
  importFromWeb,
  exportForWeb,
  replaceAllData,
} from "./db";
import type { ExtensionMessage } from "@/types";

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

function isAllowedExternalSender(
  sender: chrome.runtime.MessageSender
): boolean {
  const origin = (sender as { origin?: string }).origin;
  if (origin && isAllowedOrigin(origin)) {
    return true;
  }

  if (sender.url) {
    try {
      return isAllowedOrigin(new URL(sender.url).origin);
    } catch {
      return false;
    }
  }

  return false;
}

// Escuchar mensajes de content scripts
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse) => {
    handleMessage(message)
      .then(sendResponse)
      .catch((error) => {
        console.error("[LingText Extension] Error handling message:", error);
        sendResponse({
          error: error instanceof Error ? error.message : String(error),
        });
      });
    return true; // Indica que la respuesta será asíncrona
  }
);

async function handleMessage(message: ExtensionMessage): Promise<unknown> {
  switch (message.type) {
    case "GET_WORDS":
      return getAllWords();

    case "GET_WORD":
      return (await getWord(message.payload)) || null;

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

    case "REPLACE_ALL_DATA":
      await replaceAllData(message.payload);
      return { success: true };

    default:
      return { error: "Unknown message type" };
  }
}

// Escuchar conexiones externas (desde lingtext.org)
chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    // Verificar que viene de lingtext.org o localhost
    if (!isAllowedExternalSender(sender)) {
      sendResponse({ error: "Unauthorized origin" });
      return;
    }

    handleMessage(message as ExtensionMessage)
      .then(sendResponse)
      .catch((error) => {
        console.error(
          "[LingText Extension] Error handling external message:",
          error
        );
        sendResponse({
          error: error instanceof Error ? error.message : String(error),
        });
      });
    return true;
  }
);

console.log("[LingText Extension] Background worker initialized");
