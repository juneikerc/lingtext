import { useState, useEffect } from "react";
import type { WordEntry, PhraseEntry } from "@/types";
import { TRANSLATORS, TRANSLATOR_LABELS } from "@/utils/translate";

export default function Popup() {
  const [stats, setStats] = useState({ words: 0, phrases: 0 });
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [translator, setTranslator] = useState<TRANSLATORS>(TRANSLATORS.CHROME);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    // Cargar configuración guardada
    chrome.storage.local.get(
      ["lastSync", "translator", "openrouter_key", "lingtext_openrouter_key"],
      (result) => {
        if (result.lastSync) {
          setLastSync(new Date(result.lastSync).toLocaleString());
        }
        if (result.translator) {
          setTranslator(result.translator as TRANSLATORS);
        }
        const apiKey = result.openrouter_key || result.lingtext_openrouter_key;
        if (apiKey) {
          setApiKey(apiKey);
        }
        if (!result.openrouter_key && result.lingtext_openrouter_key) {
          chrome.storage.local.set({
            openrouter_key: result.lingtext_openrouter_key,
          });
        }
      }
    );
  }, []);

  const handleTranslatorChange = (value: TRANSLATORS) => {
    setTranslator(value);
    chrome.storage.local.set({ translator: value });
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    chrome.storage.local.set({ openrouter_key: value });
  };

  const loadStats = async () => {
    const words = (await chrome.runtime.sendMessage({
      type: "GET_WORDS",
    })) as WordEntry[];
    const phrases = (await chrome.runtime.sendMessage({
      type: "GET_PHRASES",
    })) as PhraseEntry[];
    setStats({ words: words.length, phrases: phrases.length });
  };

  const openLingText = () => {
    chrome.tabs.create({ url: "https://lingtext.org" });
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus(null);

    try {
      const lastSyncBeforeResult = await chrome.storage.local.get("lastSync");
      const lastSyncBefore =
        typeof lastSyncBeforeResult.lastSync === "number"
          ? (lastSyncBeforeResult.lastSync as number)
          : null;

      // Buscar una pestaña de lingtext.org abierta
      const tabs = await chrome.tabs.query({
        url: ["https://lingtext.org/*", "http://localhost:*/*"],
      });

      if (tabs.length === 0) {
        // No hay pestaña abierta, abrir una nueva
        setSyncStatus("Abriendo LingText...");
        await chrome.tabs.create({ url: "https://lingtext.org" });
        setSyncStatus("Abre LingText y vuelve a sincronizar");
        setSyncing(false);
        return;
      }

      // Enviar mensaje al content script (bridge) para iniciar sync
      const tab = tabs[0];
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, { type: "TRIGGER_SYNC" });
        setSyncStatus("Sincronizando...");

        const newLastSync = await new Promise<number>((resolve, reject) => {
          let timeoutId: ReturnType<typeof setTimeout> | null = null;

          const cleanup = (
            listener: (
              changes: { [key: string]: chrome.storage.StorageChange },
              areaName: string
            ) => void
          ) => {
            chrome.storage.onChanged.removeListener(listener);
            if (timeoutId) clearTimeout(timeoutId);
          };

          const listener = (
            changes: { [key: string]: chrome.storage.StorageChange },
            areaName: string
          ) => {
            if (areaName !== "local") return;
            if (!changes.lastSync) return;
            const next = changes.lastSync.newValue;
            if (
              typeof next === "number" &&
              (lastSyncBefore === null || next > lastSyncBefore)
            ) {
              cleanup(listener);
              resolve(next);
            }
          };

          chrome.storage.onChanged.addListener(listener);

          timeoutId = setTimeout(() => {
            cleanup(listener);
            reject(new Error("SYNC_TIMEOUT"));
          }, 30000);

          // Por si el sync terminó antes de que el listener se dispare
          chrome.storage.local.get("lastSync").then((result) => {
            const next = result.lastSync;
            if (
              typeof next === "number" &&
              (lastSyncBefore === null || next > lastSyncBefore)
            ) {
              cleanup(listener);
              resolve(next);
            }
          });
        });

        await loadStats();
        setLastSync(new Date(newLastSync).toLocaleString());
        setSyncStatus("✓ Sincronizado");
        setSyncing(false);
      }
    } catch (error) {
      console.error("Sync error:", error);
      setSyncStatus("Error al sincronizar");
      setSyncing(false);
    }
  };

  return (
    <div className="popup">
      <header className="popup-header">
        <div className="logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">LingText</span>
        </div>
        <span className="version">v0.1.0</span>
      </header>

      <main className="popup-body">
        <section className="stats">
          <h2>Tu vocabulario</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{stats.words}</span>
              <span className="stat-label">Palabras</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.phrases}</span>
              <span className="stat-label">Frases</span>
            </div>
          </div>
        </section>

        <section className="translator-section">
          <h2>Traductor</h2>
          <select
            className="translator-select"
            value={translator}
            onChange={(e) =>
              handleTranslatorChange(e.target.value as TRANSLATORS)
            }
          >
            {Object.entries(TRANSLATOR_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {translator !== TRANSLATORS.CHROME && (
            <div className="api-key-section">
              <label className="api-key-label">
                OpenRouter API Key
                <button
                  className="toggle-visibility"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? "🙈" : "👁️"}
                </button>
              </label>
              <input
                type={showApiKey ? "text" : "password"}
                className="api-key-input"
                placeholder="sk-or-..."
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
              />
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener"
                className="api-key-link"
              >
                Obtener API Key →
              </a>
            </div>
          )}
        </section>

        <section className="sync-section">
          <h2>Sincronización</h2>
          {lastSync && <p className="last-sync">Última sync: {lastSync}</p>}
          {syncStatus && <p className="sync-status">{syncStatus}</p>}
          <div className="sync-buttons">
            <button
              className="btn btn-primary"
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? "Sincronizando..." : "🔄 Sincronizar"}
            </button>
            <button className="btn btn-secondary" onClick={openLingText}>
              Abrir LingText
            </button>
          </div>
          <p className="sync-hint">
            La web es la fuente de verdad. Al sincronizar, los datos se combinan
            y la extensión recibe el estado final.
          </p>
        </section>

        <section className="help-section">
          <h2>Cómo usar</h2>
          <ol>
            <li>Activa los subtítulos en YouTube</li>
            <li>Haz clic en cualquier palabra para traducirla</li>
            <li>Marca palabras como conocidas o por aprender</li>
          </ol>
        </section>
      </main>

      <footer className="popup-footer">
        <a href="https://lingtext.org" target="_blank" rel="noopener">
          lingtext.org
        </a>
      </footer>
    </div>
  );
}
