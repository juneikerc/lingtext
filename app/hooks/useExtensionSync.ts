/**
 * Hook para sincronización con la extensión de Chrome
 *
 * Flujo:
 * 1. La extensión envía LINGTEXT_EXTENSION_SYNC_REQUEST o LINGTEXT_SYNC_REQUEST
 * 2. La web obtiene los datos de la extensión
 * 3. La web hace merge (newer wins) con sus datos locales
 * 4. La web guarda el resultado y lo envía de vuelta a la extensión
 * 5. La extensión reemplaza su caché con el estado final
 */

import { useEffect, useCallback } from "react";
import {
  getAllUnknownWords,
  getAllPhrases,
  putUnknownWord,
  putPhrase,
  getOpenRouterApiKey,
} from "~/services/db";
import type { WordEntry, PhraseEntry } from "~/types";

interface ExtensionSyncData {
  words: WordEntry[];
  phrases: PhraseEntry[];
}

export function useExtensionSync() {
  const handleSync = useCallback(async (extensionData: ExtensionSyncData) => {
    console.log("[ExtensionSync] Starting sync with extension data:", {
      words: extensionData.words.length,
      phrases: extensionData.phrases.length,
    });

    try {
      // Obtener datos actuales de la web
      const webWords = await getAllUnknownWords();
      const webPhrases = await getAllPhrases();
      const apiKey = await getOpenRouterApiKey();

      // Merge strategy: newer wins (basado en addedAt)
      const wordMap = new Map<string, WordEntry>();

      // Primero agregar palabras de la web
      for (const word of webWords) {
        wordMap.set(word.wordLower, word);
      }

      // Luego agregar/actualizar con palabras de la extensión (si son más nuevas)
      for (const word of extensionData.words) {
        const existing = wordMap.get(word.wordLower);
        if (!existing || word.addedAt > existing.addedAt) {
          wordMap.set(word.wordLower, word);
        }
      }

      const phraseMap = new Map<string, PhraseEntry>();

      // Primero agregar frases de la web
      for (const phrase of webPhrases) {
        phraseMap.set(phrase.phraseLower, phrase);
      }

      // Luego agregar/actualizar con frases de la extensión (si son más nuevas)
      for (const phrase of extensionData.phrases) {
        const existing = phraseMap.get(phrase.phraseLower);
        if (!existing || phrase.addedAt > existing.addedAt) {
          phraseMap.set(phrase.phraseLower, phrase);
        }
      }

      const mergedWords = Array.from(wordMap.values());
      const mergedPhrases = Array.from(phraseMap.values());

      // Guardar en la base de datos de la web
      for (const word of mergedWords) {
        await putUnknownWord(word);
      }
      for (const phrase of mergedPhrases) {
        await putPhrase(phrase);
      }

      console.log("[ExtensionSync] Merge complete:", {
        words: mergedWords.length,
        phrases: mergedPhrases.length,
      });

      // Enviar estado final a la extensión
      window.postMessage(
        {
          type: "LINGTEXT_SYNC_COMPLETE",
          payload: {
            words: mergedWords,
            phrases: mergedPhrases,
            apiKey: apiKey || undefined,
          },
        },
        "*"
      );
    } catch (error) {
      console.error("[ExtensionSync] Error during sync:", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMessage = async (event: MessageEvent) => {
      // Solo aceptar mensajes del mismo origen
      if (
        event.origin !== window.location.origin &&
        !event.origin.includes("lingtext.org") &&
        !event.origin.includes("localhost")
      ) {
        return;
      }

      const { type, payload } = event.data || {};

      switch (type) {
        case "LINGTEXT_EXTENSION_READY":
          console.log("[ExtensionSync] Extension detected");
          break;

        case "LINGTEXT_EXTENSION_SYNC_REQUEST":
          // La extensión solicita sincronización (desde el popup)
          // Primero pedimos los datos de la extensión
          window.postMessage({ type: "LINGTEXT_SYNC_REQUEST" }, "*");
          break;

        case "LINGTEXT_SYNC_RESPONSE":
          // Recibimos los datos de la extensión, hacer merge
          if (payload) {
            await handleSync(payload as ExtensionSyncData);
          }
          break;

        case "LINGTEXT_EXTENSION_SYNCED":
          console.log("[ExtensionSync] Extension confirmed sync complete");
          break;
      }
    };

    window.addEventListener("message", handleMessage);

    // Notificar que la web está lista para sincronizar
    window.postMessage({ type: "LINGTEXT_WEB_READY" }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleSync]);
}
