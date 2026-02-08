/**
 * Bridge content script for lingtext.org/localhost pages.
 * Keeps the existing web postMessage protocol and maps it to LT2 runtime messages.
 */

import type {
  PhraseEntry,
  SyncPayload,
  TRANSLATORS,
  WordEntry,
} from "@/types";

interface SyncCompletePayload {
  words: WordEntry[];
  phrases: PhraseEntry[];
  apiKey?: string;
  translator?: TRANSLATORS;
}

function isAllowedOrigin(origin: string): boolean {
  if (!origin || origin === "null") {
    return false;
  }

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

window.addEventListener("message", async (event) => {
  if (event.source !== window || !isAllowedOrigin(event.origin)) {
    return;
  }

  const { type, payload } = event.data || {};

  try {
    switch (type) {
      case "LINGTEXT_SYNC_REQUEST": {
        const data = (await chrome.runtime.sendMessage({
          type: "LT2_EXPORT_SYNC",
        })) as SyncPayload;

        window.postMessage(
          { type: "LINGTEXT_SYNC_RESPONSE", payload: data },
          event.origin
        );
        break;
      }

      case "LINGTEXT_SYNC_COMPLETE": {
        const data = payload as SyncCompletePayload;

        await chrome.runtime.sendMessage({
          type: "LT2_IMPORT_SYNC",
          payload: {
            words: data.words || [],
            phrases: data.phrases || [],
          },
        });

        const settingsPatch: {
          apiKey?: string;
          translator?: TRANSLATORS;
        } = {};

        if (typeof data.apiKey === "string") {
          settingsPatch.apiKey = data.apiKey;
        }

        if (data.translator) {
          settingsPatch.translator = data.translator;
        }

        if (Object.keys(settingsPatch).length > 0) {
          await chrome.runtime.sendMessage({
            type: "LT2_SET_SETTINGS",
            payload: settingsPatch,
          });
        }

        window.postMessage(
          { type: "LINGTEXT_EXTENSION_SYNCED", payload: { success: true } },
          event.origin
        );
        break;
      }

      // Legacy compatibility from old web flow.
      case "LINGTEXT_IMPORT_TO_EXTENSION": {
        const data = payload as SyncPayload;
        await chrome.runtime.sendMessage({
          type: "LT2_IMPORT_SYNC",
          payload: {
            words: data.words || [],
            phrases: data.phrases || [],
          },
        });

        window.postMessage(
          { type: "LINGTEXT_IMPORT_COMPLETE", payload: { success: true } },
          event.origin
        );
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("[LingText Bridge] Message handling failed:", error);
    window.postMessage(
      {
        type: "LINGTEXT_EXTENSION_SYNCED",
        payload: {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        },
      },
      event.origin
    );
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "TRIGGER_SYNC") {
    return true;
  }

  window.postMessage(
    { type: "LINGTEXT_EXTENSION_SYNC_REQUEST" },
    window.location.origin
  );
  sendResponse({ triggered: true });

  return true;
});

window.postMessage({ type: "LINGTEXT_EXTENSION_READY" }, window.location.origin);
