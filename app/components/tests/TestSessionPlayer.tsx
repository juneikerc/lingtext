import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import TestResultShareCard from "~/components/tests/TestResultShareCard";
import {
  getDictationHint,
  getMaxScore,
  getResultBand,
  isDictationQuestion,
  resolveClozeQuestion,
  resolveDictationQuestion,
  resolveReorderQuestion,
} from "~/features/tests/engine";
import { getTestLevelMeta, getTestSkillMeta } from "~/features/tests/catalog";
import type { TestDefinition } from "~/features/tests/types";
import { getSettings } from "~/services/db/settings";
import { speak, stop } from "~/utils/tts";

interface TestSessionPlayerProps {
  test: TestDefinition;
  sessionId: string;
}

interface CompletedResult {
  questionId: string;
  isCorrect: boolean;
  pointsAwarded: number;
  attemptsUsed: number;
}

interface FeedbackState {
  variant: "idle" | "retry" | "resolved";
  tone?: "success" | "danger" | "neutral";
  title?: string;
  body?: string;
  hint?: string;
}

function getFeedbackClasses(tone: FeedbackState["tone"]) {
  if (tone === "success") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (tone === "danger") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }

  return "border-gray-200 bg-gray-50 text-gray-700";
}

export default function TestSessionPlayer({
  test,
  sessionId,
}: TestSessionPlayerProps) {
  const levelMeta = getTestLevelMeta(test.level);
  const skillMeta = getTestSkillMeta(test.skill);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedResults, setCompletedResults] = useState<CompletedResult[]>(
    []
  );
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [reorderSelection, setReorderSelection] = useState<number[]>([]);
  const [dictationAttempts, setDictationAttempts] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>({ variant: "idle" });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);

  const currentQuestion = test.questions[currentIndex];
  const isLastQuestion = currentIndex === test.questions.length - 1;
  const progressPercent = Math.round(
    ((currentIndex + (feedback.variant === "resolved" ? 1 : 0)) /
      test.questions.length) *
      100
  );

  const score = useMemo(
    () =>
      completedResults.reduce(
        (total, result) => total + result.pointsAwarded,
        0
      ),
    [completedResults]
  );
  const correctAnswers = completedResults.filter(
    (result) => result.isCorrect
  ).length;
  const maxScore = getMaxScore(test);
  const scorePercent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const resultBand = getResultBand(test.resultBands, scorePercent);
  const shareUrl =
    typeof window === "undefined"
      ? `https://lingtext.org/tests/${test.level}`
      : `${window.location.origin}/tests/${test.level}`;

  useEffect(() => {
    setSelectedChoiceId(null);
    setTextAnswer("");
    setReorderSelection([]);
    setDictationAttempts(0);
    setFeedback({ variant: "idle" });
    setTtsError(null);
  }, [currentIndex]);

  useEffect(() => {
    return () => stop();
  }, []);

  async function handlePlayDictation() {
    if (!isDictationQuestion(currentQuestion)) {
      return;
    }

    setTtsError(null);

    try {
      setIsPlaying(true);
      const settings = await getSettings();
      await speak(currentQuestion.transcript, settings.tts);
    } catch {
      setTtsError("No se pudo reproducir el audio en este navegador.");
    } finally {
      setIsPlaying(false);
    }
  }

  function commitResolvedQuestion(
    result: CompletedResult,
    nextFeedback: FeedbackState
  ) {
    setCompletedResults((currentResults) => [...currentResults, result]);
    setFeedback(nextFeedback);
  }

  function handleSubmit() {
    if (feedback.variant === "resolved") {
      return;
    }

    if (currentQuestion.type === "multiple-choice") {
      if (!selectedChoiceId) {
        setFeedback({
          variant: "retry",
          tone: "danger",
          title: "Selecciona una opcion",
          body: "Antes de enviar, elige una respuesta.",
        });
        return;
      }

      const isCorrect = selectedChoiceId === currentQuestion.correctChoiceId;
      commitResolvedQuestion(
        {
          questionId: currentQuestion.id,
          isCorrect,
          pointsAwarded: isCorrect ? currentQuestion.points : 0,
          attemptsUsed: 1,
        },
        {
          variant: "resolved",
          tone: isCorrect ? "success" : "danger",
          title: isCorrect ? "Correcto" : "Respuesta incorrecta",
          body: currentQuestion.explanation,
        }
      );
      return;
    }

    if (currentQuestion.type === "cloze") {
      if (!textAnswer.trim()) {
        setFeedback({
          variant: "retry",
          tone: "danger",
          title: "Escribe una respuesta",
          body: "Completa el hueco antes de enviar.",
        });
        return;
      }

      const resolution = resolveClozeQuestion(currentQuestion, textAnswer);
      commitResolvedQuestion(
        {
          questionId: currentQuestion.id,
          isCorrect: resolution.isCorrect,
          pointsAwarded: resolution.pointsAwarded,
          attemptsUsed: 1,
        },
        {
          variant: "resolved",
          tone: resolution.isCorrect ? "success" : "danger",
          title: resolution.isCorrect ? "Correcto" : "No coincide",
          body: currentQuestion.explanation,
          hint:
            !resolution.isCorrect && currentQuestion.hint
              ? `Pista: ${currentQuestion.hint}`
              : undefined,
        }
      );
      return;
    }

    if (currentQuestion.type === "reorder") {
      if (reorderSelection.length !== currentQuestion.tokens.length) {
        setFeedback({
          variant: "retry",
          tone: "danger",
          title: "Faltan palabras",
          body: "Usa todos los bloques para construir la respuesta completa.",
        });
        return;
      }

      const selectedWords = reorderSelection.map(
        (index) => currentQuestion.tokens[index]
      );
      const resolution = resolveReorderQuestion(currentQuestion, selectedWords);
      commitResolvedQuestion(
        {
          questionId: currentQuestion.id,
          isCorrect: resolution.isCorrect,
          pointsAwarded: resolution.pointsAwarded,
          attemptsUsed: 1,
        },
        {
          variant: "resolved",
          tone: resolution.isCorrect ? "success" : "danger",
          title: resolution.isCorrect ? "Buen orden" : "Orden incorrecto",
          body: currentQuestion.explanation,
        }
      );
      return;
    }

    if (!textAnswer.trim()) {
      setFeedback({
        variant: "retry",
        tone: "danger",
        title: "Escribe lo que oyes",
        body: "Necesitas una respuesta antes de revisar el dictado.",
      });
      return;
    }

    const nextAttempt = dictationAttempts + 1;
    const resolution = resolveDictationQuestion(
      currentQuestion,
      textAnswer,
      nextAttempt
    );

    setDictationAttempts(nextAttempt);

    if (resolution.isCorrect) {
      commitResolvedQuestion(
        {
          questionId: currentQuestion.id,
          isCorrect: true,
          pointsAwarded: resolution.pointsAwarded,
          attemptsUsed: nextAttempt,
        },
        {
          variant: "resolved",
          tone: "success",
          title: "Dictado correcto",
          body:
            nextAttempt === 1
              ? "Lo resolviste al primer intento."
              : `Lo resolviste en ${nextAttempt} intentos.`,
        }
      );
      return;
    }

    if (nextAttempt >= currentQuestion.maxAttempts) {
      commitResolvedQuestion(
        {
          questionId: currentQuestion.id,
          isCorrect: false,
          pointsAwarded: 0,
          attemptsUsed: nextAttempt,
        },
        {
          variant: "resolved",
          tone: "danger",
          title: "Se acabaron los intentos",
          body: `La respuesta correcta era: ${currentQuestion.transcript}`,
        }
      );
      return;
    }

    setFeedback({
      variant: "retry",
      tone: "neutral",
      title: `Intento ${nextAttempt} de ${currentQuestion.maxAttempts}`,
      body: "No coincide todavia. Se desbloquearon nuevas letras para ayudarte.",
      hint: getDictationHint(currentQuestion, nextAttempt + 1),
    });
  }

  function handleNext() {
    if (feedback.variant !== "resolved") {
      return;
    }

    if (isLastQuestion) {
      setIsFinishing(true);
      return;
    }

    setCurrentIndex((value) => value + 1);
  }

  function handleSelectToken(tokenIndex: number) {
    if (feedback.variant === "resolved") {
      return;
    }

    setReorderSelection((current) =>
      current.includes(tokenIndex) ? current : [...current, tokenIndex]
    );
  }

  function handleRemoveToken(tokenIndex: number) {
    if (feedback.variant === "resolved") {
      return;
    }

    setReorderSelection((current) =>
      current.filter((index) => index !== tokenIndex)
    );
  }

  function handleClearOrder() {
    if (feedback.variant === "resolved") {
      return;
    }

    setReorderSelection([]);
  }

  if (isFinishing) {
    return (
      <div className="space-y-8">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#0F9EDA]">
                Resultado de la sesion
              </p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                {test.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
                {scorePercent}% · {resultBand.label}. {resultBand.summary}
              </p>
            </div>
            <div className="grid gap-3 sm:min-w-56">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                  Respuestas correctas
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {correctAnswers}/{test.questions.length}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                  Session ID
                </p>
                <p className="mt-1 truncate text-sm font-medium text-gray-700">
                  {sessionId}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Link
              to={`/tests/${test.level}`}
              className="inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Probar otro test de {levelMeta.name}
            </Link>
            <Link
              to={`/levels/${test.level}`}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Ir a lecturas {levelMeta.name}
            </Link>
            <Link
              to="/review"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Abrir review de vocabulario
            </Link>
          </div>
        </section>

        <TestResultShareCard
          levelName={levelMeta.name}
          skillName={skillMeta.name}
          scorePercent={scorePercent}
          shareUrl={shareUrl}
        />
      </div>
    );
  }

  const selectedWords =
    currentQuestion.type === "reorder"
      ? reorderSelection.map((index) => currentQuestion.tokens[index])
      : [];
  const currentFeedbackVisible = feedback.variant !== "idle";
  const dictationPreview =
    currentQuestion.type === "dictation" && feedback.variant === "retry"
      ? feedback.hint
      : currentQuestion.type === "dictation"
        ? getDictationHint(currentQuestion, 1)
        : null;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0F9EDA]">
              {skillMeta.name} {levelMeta.name}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              {test.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
              {test.intro}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
              Progreso
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {currentIndex + 1}/{test.questions.length}
            </p>
            <p className="text-sm text-gray-500">
              {progressPercent}% completado
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-[#0F9EDA] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0F9EDA]">
            Pregunta {currentIndex + 1}
          </span>
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-600">
            {currentQuestion.type}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentQuestion.prompt}
            </h2>
            {currentQuestion.description ? (
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {currentQuestion.description}
              </p>
            ) : null}
          </div>

          {currentQuestion.type === "multiple-choice" &&
          currentQuestion.passage ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm leading-relaxed text-gray-700">
              {currentQuestion.passage}
            </div>
          ) : null}

          {currentQuestion.type === "multiple-choice" ? (
            <div className="grid gap-3">
              {currentQuestion.choices.map((choice) => {
                const isSelected = selectedChoiceId === choice.id;

                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => setSelectedChoiceId(choice.id)}
                    disabled={feedback.variant === "resolved"}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      isSelected
                        ? "border-[#0F9EDA] bg-[#0F9EDA]/5 text-gray-900"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {choice.text}
                  </button>
                );
              })}
            </div>
          ) : null}

          {currentQuestion.type === "cloze" ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-base font-medium text-gray-900">
                {currentQuestion.sentence}
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  Tu respuesta
                </span>
                <input
                  value={textAnswer}
                  onChange={(event) => setTextAnswer(event.target.value)}
                  disabled={feedback.variant === "resolved"}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition-colors duration-200 placeholder:text-gray-400 focus:border-[#0F9EDA] focus:ring-2 focus:ring-[#0F9EDA]/20"
                  placeholder="Escribe la palabra o expresion"
                />
              </label>
            </div>
          ) : null}

          {currentQuestion.type === "reorder" ? (
            <div className="space-y-5">
              {currentQuestion.clue ? (
                <p className="text-sm text-gray-600">{currentQuestion.clue}</p>
              ) : null}
              <div>
                <p className="mb-3 text-sm font-semibold text-gray-700">
                  Tu orden
                </p>
                <div className="min-h-16 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4">
                  {selectedWords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {reorderSelection.map((tokenIndex) => (
                        <button
                          key={`selected-${tokenIndex}`}
                          type="button"
                          onClick={() => handleRemoveToken(tokenIndex)}
                          className="rounded-full bg-[#0F9EDA] px-3 py-1.5 text-sm font-semibold text-white"
                        >
                          {currentQuestion.tokens[tokenIndex]}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Toca los bloques de abajo para formar la frase.
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold text-gray-700">
                  Bloques
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.tokens.map((token, tokenIndex) => {
                    const isUsed = reorderSelection.includes(tokenIndex);
                    return (
                      <button
                        key={`${token}-${tokenIndex}`}
                        type="button"
                        onClick={() => handleSelectToken(tokenIndex)}
                        disabled={isUsed || feedback.variant === "resolved"}
                        className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                          isUsed
                            ? "border-gray-200 bg-gray-100 text-gray-400"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {token}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearOrder}
                disabled={
                  feedback.variant === "resolved" ||
                  reorderSelection.length === 0
                }
                className="text-sm font-semibold text-gray-600 transition-colors duration-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                Limpiar orden
              </button>
            </div>
          ) : null}

          {currentQuestion.type === "dictation" ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {currentQuestion.hintLabel}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Tienes {currentQuestion.maxAttempts} intentos. En cada
                      fallo se revelan mas letras.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePlayDictation}
                    className="inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                  >
                    {isPlaying ? "Reproduciendo..." : "Escuchar audio"}
                  </button>
                </div>
                <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                    Pista visual
                  </p>
                  <p className="mt-2 break-words font-mono text-base text-gray-800">
                    {dictationPreview}
                  </p>
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  Escribe exactamente lo que oyes
                </span>
                <textarea
                  value={textAnswer}
                  onChange={(event) => setTextAnswer(event.target.value)}
                  disabled={feedback.variant === "resolved"}
                  rows={3}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition-colors duration-200 placeholder:text-gray-400 focus:border-[#0F9EDA] focus:ring-2 focus:ring-[#0F9EDA]/20"
                  placeholder="Escribe la frase aqui"
                />
              </label>

              {ttsError ? (
                <p className="text-sm text-rose-600">{ttsError}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        {currentFeedbackVisible ? (
          <div
            className={`mt-6 rounded-2xl border px-4 py-4 text-sm leading-relaxed ${getFeedbackClasses(feedback.tone)}`}
          >
            {feedback.title ? (
              <p className="font-semibold">{feedback.title}</p>
            ) : null}
            {feedback.body ? <p className="mt-1">{feedback.body}</p> : null}
            {feedback.hint ? (
              <p className="mt-3 font-mono text-xs tracking-wide">
                {feedback.hint}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500">
            {feedback.variant === "resolved"
              ? "Puedes avanzar cuando quieras."
              : test.instructions}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {feedback.variant === "resolved" ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                {isLastQuestion ? "Ver resultado" : "Siguiente pregunta"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Comprobar respuesta
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
