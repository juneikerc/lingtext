/**
 * Background service worker entrypoint.
 */

import type { ExtensionMessage } from "@/types";

import { handleMessage } from "./router";
import { initializeStore } from "./store";

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

  if (!sender.url) {
    return false;
  }

  try {
    return isAllowedOrigin(new URL(sender.url).origin);
  } catch {
    return false;
  }
}

const storeReady = initializeStore().catch((error) => {
  console.error("[LingText] Failed to initialize extension store:", error);
  throw error;
});

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse) => {
    storeReady
      .then(() => handleMessage(message))
      .then(sendResponse)
      .catch((error) => {
        console.error("[LingText] Error handling runtime message:", error);
        sendResponse({
          error: error instanceof Error ? error.message : String(error),
        });
      });

    return true;
  }
);

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (!isAllowedExternalSender(sender)) {
    sendResponse({ error: "Unauthorized origin" });
    return;
  }

  storeReady
    .then(() => handleMessage(message as ExtensionMessage))
    .then(sendResponse)
    .catch((error) => {
      console.error("[LingText] Error handling external message:", error);
      sendResponse({
        error: error instanceof Error ? error.message : String(error),
      });
    });

  return true;
});
