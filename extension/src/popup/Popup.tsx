import { useState, useEffect } from "react";
import type { WordEntry, PhraseEntry } from "@/types";
import { TRANSLATORS, TRANSLATOR_LABELS } from "@/utils/translate";

export default function Popup() {
  const [stats, setStats] = useState({ words: 0, phrases: 0 });
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [translator, setTranslator] = useState<TRANSLATORS>(TRANSLATORS.CHROME);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    loadStats();
    // Cargar configuración guardada
    chrome.storage.local.get(
      ["lastSync", "translator", "openrouter_key"],
      (result) => {
        if (result.lastSync) {
          setLastSync(new Date(result.lastSync).toLocaleString());
        }
        if (result.translator) {
          setTranslator(result.translator as TRANSLATORS);
        }
        if (result.openrouter_key) {
          setApiKey(result.openrouter_key);
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
          <p className="sync-hint">
            Abre LingText para sincronizar tu vocabulario
          </p>
          <button className="btn btn-primary" onClick={openLingText}>
            Abrir LingText
          </button>
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
