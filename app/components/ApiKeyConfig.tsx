import { useState, useEffect } from "react";
import {
  getOpenRouterApiKey,
  saveOpenRouterApiKey,
  deleteOpenRouterApiKey,
} from "../services/db";

interface ApiKeyConfigProps {
  onClose: () => void;
}

export default function ApiKeyConfig({ onClose }: ApiKeyConfigProps) {
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApiKey();
  }, []);

  async function loadApiKey() {
    const key = await getOpenRouterApiKey();
    if (key) {
      setApiKey(key);
      setHasKey(true);
    }
  }

  async function handleSave() {
    if (!apiKey.trim()) {
      setError("Por favor ingresa una API key válida");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Test the API key with a simple request
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("API key inválida. Verifica que sea correcta.");
          setSaving(false);
          return;
        }
      }

      await saveOpenRouterApiKey(apiKey.trim());
      setHasKey(true);
      onClose();
    } catch {
      setError("Error al verificar la API key. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("¿Estás seguro de eliminar tu API key?")) return;

    await deleteOpenRouterApiKey();
    setApiKey("");
    setHasKey(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Configurar OpenRouter
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Para usar los traductores con IA necesitas tu propia API key de{" "}
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            OpenRouter
          </a>
          . Los modelos gratuitos no tienen costo.
        </p>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showKey ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          {hasKey && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
            >
              Eliminar
            </button>
          )}
          <div className="flex space-x-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors text-sm font-medium"
            >
              {saving ? "Verificando..." : "Guardar"}
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tu API key se guarda localmente en tu navegador y nunca se envía a
            nuestros servidores.
          </p>
        </div>
      </div>
    </div>
  );
}
