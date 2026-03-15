import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  deleteWord,
  getAllPhraseParts,
  getAllUnknownWordLowers,
  getSettings,
  putPhrase,
  putUnknownWord,
} from "~/services/db";

export type ReaderPhraseIndex = Map<string, string[][]>;

interface ReaderLexiconContextValue {
  isReady: boolean;
  unknownSet: Set<string>;
  phrases: string[][];
  phraseIndex: ReaderPhraseIndex;
  markUnknownWord: (
    lower: string,
    original: string,
    translation: string
  ) => Promise<void>;
  markKnownWord: (lower: string) => Promise<void>;
  savePhraseEntry: (
    phrase: string,
    translation: string,
    parts: string[]
  ) => Promise<void>;
}

const ReaderLexiconContext =
  createContext<ReaderLexiconContextValue | null>(null);

function buildPhraseIndex(phrases: string[][]): ReaderPhraseIndex {
  const phraseIndex: ReaderPhraseIndex = new Map();

  for (const parts of phrases) {
    if (parts.length < 2) continue;

    const firstPart = parts[0];
    const bucket = phraseIndex.get(firstPart);

    if (bucket) {
      bucket.push(parts);
    } else {
      phraseIndex.set(firstPart, [parts]);
    }
  }

  for (const bucket of phraseIndex.values()) {
    bucket.sort((a, b) => b.length - a.length);
  }

  return phraseIndex;
}

function appendPhraseIfMissing(currentPhrases: string[][], parts: string[]) {
  const phraseLower = parts.join(" ");

  if (
    currentPhrases.some((currentParts) => currentParts.join(" ") === phraseLower)
  ) {
    return currentPhrases;
  }

  return [...currentPhrases, parts];
}

export function ReaderLexiconProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);
  const [unknownSet, setUnknownSet] = useState<Set<string>>(new Set());
  const [phrases, setPhrases] = useState<string[][]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadLexicon() {
      try {
        const [unknownWords, phraseParts] = await Promise.all([
          getAllUnknownWordLowers(),
          getAllPhraseParts(),
        ]);

        if (!mounted) return;

        setUnknownSet(new Set(unknownWords));
        setPhrases(phraseParts);
      } catch (error) {
        console.error("[DB] Error: no se pudo cargar el lexico del lector:", error);
      } finally {
        if (mounted) {
          setIsReady(true);
        }
      }
    }

    void loadLexicon();

    return () => {
      mounted = false;
    };
  }, []);

  const markUnknownWord = useCallback(
    async (lower: string, original: string, translation: string) => {
      const settings = await getSettings();

      await putUnknownWord({
        word: original,
        wordLower: lower,
        translation,
        status: "unknown",
        addedAt: Date.now(),
        voice: {
          name: settings.tts.voiceName,
          lang: settings.tts.lang,
          rate: settings.tts.rate,
          pitch: settings.tts.pitch,
          volume: settings.tts.volume,
        },
      });

      setUnknownSet((currentUnknowns) => {
        if (currentUnknowns.has(lower)) {
          return currentUnknowns;
        }

        const nextUnknowns = new Set(currentUnknowns);
        nextUnknowns.add(lower);
        return nextUnknowns;
      });
    },
    []
  );

  const markKnownWord = useCallback(async (lower: string) => {
    await deleteWord(lower);

    setUnknownSet((currentUnknowns) => {
      if (!currentUnknowns.has(lower)) {
        return currentUnknowns;
      }

      const nextUnknowns = new Set(currentUnknowns);
      nextUnknowns.delete(lower);
      return nextUnknowns;
    });
  }, []);

  const savePhraseEntry = useCallback(
    async (phrase: string, translation: string, parts: string[]) => {
      await putPhrase({
        phrase,
        phraseLower: parts.join(" "),
        translation,
        parts,
        addedAt: Date.now(),
      });

      setPhrases((currentPhrases) => appendPhraseIfMissing(currentPhrases, parts));
    },
    []
  );

  const phraseIndex = useMemo(() => buildPhraseIndex(phrases), [phrases]);

  const contextValue = useMemo<ReaderLexiconContextValue>(
    () => ({
      isReady,
      unknownSet,
      phrases,
      phraseIndex,
      markUnknownWord,
      markKnownWord,
      savePhraseEntry,
    }),
    [
      isReady,
      markKnownWord,
      markUnknownWord,
      phraseIndex,
      phrases,
      savePhraseEntry,
      unknownSet,
    ]
  );

  return (
    <ReaderLexiconContext.Provider value={contextValue}>
      {children}
    </ReaderLexiconContext.Provider>
  );
}

export function useReaderLexicon() {
  const context = useContext(ReaderLexiconContext);

  if (!context) {
    return {
      isReady: false,
      unknownSet: new Set<string>(),
      phrases: [],
      phraseIndex: new Map<string, string[][]>(),
      markUnknownWord: async () => {},
      markKnownWord: async () => {},
      savePhraseEntry: async () => {},
    } satisfies ReaderLexiconContextValue;
  }

  return context;
}
