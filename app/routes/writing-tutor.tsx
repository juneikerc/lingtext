import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Route } from "./+types/writing-tutor";
import ApiKeyConfig from "~/components/ApiKeyConfig";
import { getOpenRouterApiKey } from "~/services/db";
import {
  requestWritingTutor,
  type TutorConversationMessage,
} from "~/utils/writing-tutor";

interface FeedbackState {
  hint: string;
  focusAreas: string[];
  suggestedRewrite?: string | null;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tutor de escritura en inglés | LingText" },
    {
      name: "description",
      content:
        "Practica escritura en inglés con un tutor conversacional que te guía con el método socrático.",
    },
  ];
}

const ERROR_MESSAGES: Record<string, string> = {
  NO_API_KEY:
    "Necesitas configurar tu API key de OpenRouter para usar el tutor.",
  INVALID_API_KEY:
    "Tu API key no es válida. Revísala desde la configuración.",
  RATE_LIMITED:
    "Límite alcanzado. Espera un momento y vuelve a intentarlo.",
  NETWORK_ERROR:
    "Error de conexión. Verifica tu red e intenta nuevamente.",
  API_ERROR: "Error del servicio. Intenta más tarde.",
  INVALID_RESPONSE: "Respuesta inválida del tutor. Intenta nuevamente.",
  INVALID_TOPIC: "El tópico no puede estar vacío.",
};

export default function WritingTutor() {
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState<TutorConversationMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [showApiKeyConfig, setShowApiKeyConfig] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [level, setLevel] = useState("B1");
  const [model, setModel] = useState("google/gemini-2.5-flash-lite");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  useEffect(() => {
    if (!showApiKeyConfig) {
      checkApiKey();
    }
  }, [showApiKeyConfig]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, isStarting]);

  async function checkApiKey() {
    const key = await getOpenRouterApiKey();
    setHasApiKey(!!key);
  }

  async function handleStart() {
    setError(null);
    setFeedback(null);

    if (!topic.trim()) {
      setError(ERROR_MESSAGES.INVALID_TOPIC);
      return;
    }

    if (!hasApiKey) {
      setError(ERROR_MESSAGES.NO_API_KEY);
      return;
    }

    setIsStarting(true);
    try {
      const result = await requestWritingTutor({
        mode: "start",
        topic,
        conversation: [],
        level: level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
        model,
      });

      if (result.error || !result.data?.assistantReply) {
        setError(ERROR_MESSAGES[result.error || "API_ERROR"]);
        return;
      }

      setMessages([{ role: "assistant", content: result.data.assistantReply }]);
      setConversationStarted(true);
    } finally {
      setIsStarting(false);
    }
  }

  async function handleSend() {
    if (isSending || isStarting || !conversationStarted) return;

    setError(null);
    setFeedback(null);

    const trimmed = input.trim();
    if (!trimmed) return;

    setIsSending(true);
    try {
      const result = await requestWritingTutor({
        mode: "reply",
        topic,
        conversation: messages,
        userMessage: trimmed,
        level: level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
        model,
      });

      if (result.error || !result.data) {
        setError(ERROR_MESSAGES[result.error || "API_ERROR"]);
        return;
      }

      if (result.data.status === "accept" && result.data.assistantReply) {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: trimmed },
          { role: "assistant", content: result.data.assistantReply as string },
        ]);
        setInput("");
        return;
      }

      setFeedback({
        hint: result.data.socraticHint || "",
        focusAreas: result.data.focusAreas || [],
        suggestedRewrite: result.data.suggestedRewrite,
      });
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  }

  function handleReset() {
    setMessages([]);
    setInput("");
    setError(null);
    setFeedback(null);
    setConversationStarted(false);
  }

  const isReadyToStart =
    !conversationStarted && !isStarting && !!topic.trim();
  const isChatDisabled =
    !conversationStarted || isSending || isStarting || !!feedback;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-12">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Tutor de escritura
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
            Practica escritura en inglés con conversación guiada
          </h1>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
            Ingresa un tópico y el tutor iniciará una conversación aleatoria.
            Cada respuesta se evalúa y recibirás pistas socráticas hasta lograr
            una escritura clara en inglés.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[320px_1fr]">
          <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Configuración rápida
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Elige un tema en español. El tutor conversará en inglés y te hará
              preguntas para practicar escritura.
            </p>

            <label className="mt-6 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tópico
            </label>
            <input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Ej: viajes, cocina casera, música indie..."
              className="mt-2 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/40 transition-colors duration-200"
            />

            <label className="mt-5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nivel del tutor
            </label>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/40 transition-colors duration-200"
            >
              <option value="A1">A1 - Básico inicial</option>
              <option value="A2">A2 - Básico</option>
              <option value="B1">B1 - Intermedio</option>
              <option value="B2">B2 - Intermedio alto</option>
              <option value="C1">C1 - Avanzado</option>
              <option value="C2">C2 - Proficiente</option>
            </select>

            <label className="mt-5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Modelo IA
            </label>
            <select
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/40 transition-colors duration-200"
            >
              <option value="google/gemini-2.5-flash-lite">
                Gemini 2.5 Flash Lite (más económico)
              </option>
              <option value="google/gemini-3-flash-preview">
                Gemini 3 Flash Preview (más potente)
              </option>
            </select>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleStart}
                disabled={!isReadyToStart || !hasApiKey}
                className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors duration-200"
              >
                {isStarting ? "Iniciando..." : "Iniciar conversación"}
              </button>
              <button
                onClick={handleReset}
                disabled={!conversationStarted}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Reiniciar
              </button>
            </div>

            {!hasApiKey && (
              <div className="mt-6 rounded-xl border border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-700 dark:text-amber-200">
                <p className="font-semibold">
                  Esta funcionalidad requiere una API key de OpenRouter
                </p>
                <p className="mt-1 text-xs">
                  Sin una key no es posible usar el tutor. Agrégala desde tu
                  configuración.
                </p>
                <button
                  onClick={() => setShowApiKeyConfig(true)}
                  className="mt-3 w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors duration-200"
                >
                  Configurar API key
                </button>
              </div>
            )}

            <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-gray-700 dark:text-gray-200">
                Consejos rápidos
              </p>
              <ul className="mt-2 space-y-1">
                <li>Responde en inglés, 1-3 frases.</li>
                <li>Si recibes una pista, reescribe y vuelve a intentar.</li>
                <li>Enfócate en claridad antes que perfección.</li>
              </ul>
            </div>
          </section>

          <section className="flex min-h-[520px] flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Conversación guiada
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {conversationStarted ? `Tema: ${topic}` : "Lista para iniciar"}
                </p>
              </div>
              <div className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-200">
                Nivel: {level}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="mb-3 text-3xl">✍️</div>
                  <p>Ingresa un tópico y presiona iniciar.</p>
                  <p className="mt-1">
                    El tutor abrirá la conversación con una pregunta.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isAssistant = message.role === "assistant";
                    return (
                      <div
                        key={`${message.role}-${index}`}
                        className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                            isAssistant
                              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                              : "bg-indigo-600 text-white"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
              {error && (
                <div className="mb-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-2 text-xs text-red-700 dark:text-red-200">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Tu respuesta (en inglés)
                  </label>
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isChatDisabled}
                    rows={3}
                    placeholder={
                      conversationStarted
                        ? "Escribe tu respuesta aquí..."
                        : "Inicia una conversación para habilitar el chat."
                    }
                    className="mt-2 w-full resize-none rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/40 transition-colors duration-200 disabled:opacity-60"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={isChatDisabled || !input.trim()}
                  className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors duration-200 sm:w-auto"
                >
                  {isSending ? "Evaluando..." : "Enviar"}
                </button>
              </div>
              {feedback && (
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Hay una pista pendiente. Revísala y vuelve a intentar.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      {feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-600">
                  Pista socrática
                </p>
                <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                  Revisa tu respuesta
                </h3>
              </div>
              <button
                onClick={() => setFeedback(null)}
                className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-gray-700 dark:text-gray-200">
              <p>{feedback.hint}</p>

              {feedback.focusAreas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {feedback.focusAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-200"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}

              {feedback.suggestedRewrite && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-3 text-xs text-gray-600 dark:text-gray-300">
                  <p className="font-semibold text-gray-700 dark:text-gray-200">
                    Una opción más natural podría ser:
                  </p>
                  <p className="mt-1 text-sm">{feedback.suggestedRewrite}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setFeedback(null)}
                className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Volver a intentar
              </button>
              <button
                onClick={() => setFeedback(null)}
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors duration-200"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {showApiKeyConfig && (
        <ApiKeyConfig onClose={() => setShowApiKeyConfig(false)} />
      )}
    </main>
  );
}
