import { useState, useEffect } from "react";
import type { WordEntry, PhraseEntry } from "@/types";

export default function Popup() {
  const [stats, setStats] = useState({ words: 0, phrases: 0 });
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    // Cargar última sincronización
    chrome.storage.local.get("lastSync", (result) => {
      if (result.lastSync) {
        setLastSync(new Date(result.lastSync).toLocaleString());
      }
    });
  }, []);

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
