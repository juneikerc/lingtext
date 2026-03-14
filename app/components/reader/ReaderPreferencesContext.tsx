import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MutableRefObject } from "react";

import { getSettings, saveSettings } from "~/services/db";
import type { ReaderPreferences, ReaderPreset, Settings } from "~/types";

import {
  DEFAULT_READER_PREFERENCES,
  getPresetPreferences,
  resolveReaderPreferences,
} from "./preferences";

interface ReaderPreferencesContextValue {
  preferences: ReaderPreferences;
  isReady: boolean;
  applyPreset: (preset: Exclude<ReaderPreset, "custom">) => void;
  updatePreference: <K extends keyof ReaderPreferences>(
    key: K,
    value: ReaderPreferences[K]
  ) => void;
  resetPreferences: () => void;
}

const ReaderPreferencesContext =
  createContext<ReaderPreferencesContextValue | null>(null);

async function persistReaderPreferences(
  settingsRef: MutableRefObject<Settings | null>,
  nextPreferences: ReaderPreferences
) {
  const baseSettings = settingsRef.current ?? (await getSettings());
  const nextSettings: Settings = {
    ...baseSettings,
    reader: resolveReaderPreferences(nextPreferences),
  };

  settingsRef.current = nextSettings;
  await saveSettings(nextSettings);
}

export function ReaderPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState<ReaderPreferences>(
    DEFAULT_READER_PREFERENCES
  );
  const [isReady, setIsReady] = useState(false);
  const settingsRef = useRef<Settings | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPreferences() {
      try {
        const settings = await getSettings();
        if (!mounted) return;

        settingsRef.current = settings;
        setPreferences(resolveReaderPreferences(settings.reader));
      } catch (error) {
        console.error("[DB] Error: no se pudieron cargar las preferencias:", error);
      } finally {
        if (mounted) {
          setIsReady(true);
        }
      }
    }

    void loadPreferences();

    return () => {
      mounted = false;
    };
  }, []);

  const applyPreset = useCallback(
    (preset: Exclude<ReaderPreset, "custom">) => {
      const nextPreferences = getPresetPreferences(preset);
      setPreferences(nextPreferences);
      void persistReaderPreferences(settingsRef, nextPreferences);
    },
    []
  );

  const updatePreference = useCallback(
    <K extends keyof ReaderPreferences>(
      key: K,
      value: ReaderPreferences[K]
    ) => {
      setPreferences((currentPreferences) => {
        const nextPreferences =
          key === "preset"
            ? resolveReaderPreferences({
                ...currentPreferences,
                preset: value as ReaderPreferences["preset"],
              })
            : resolveReaderPreferences({
                ...currentPreferences,
                [key]: value,
                preset: "custom",
              });

        void persistReaderPreferences(settingsRef, nextPreferences);
        return nextPreferences;
      });
    },
    []
  );

  const resetPreferences = useCallback(() => {
    const nextPreferences = DEFAULT_READER_PREFERENCES;
    setPreferences(nextPreferences);
    void persistReaderPreferences(settingsRef, nextPreferences);
  }, []);

  const contextValue = useMemo<ReaderPreferencesContextValue>(
    () => ({
      preferences,
      isReady,
      applyPreset,
      updatePreference,
      resetPreferences,
    }),
    [applyPreset, isReady, preferences, resetPreferences, updatePreference]
  );

  return (
    <ReaderPreferencesContext.Provider value={contextValue}>
      {children}
    </ReaderPreferencesContext.Provider>
  );
}

export function useReaderPreferences() {
  const context = useContext(ReaderPreferencesContext);

  if (!context) {
    return {
      preferences: DEFAULT_READER_PREFERENCES,
      isReady: false,
      applyPreset: () => {},
      updatePreference: () => {},
      resetPreferences: () => {},
    } as ReaderPreferencesContextValue;
  }

  return context;
}
