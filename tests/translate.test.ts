import { afterEach, describe, expect, it, vi } from "vitest";

import { translateTerm, translateWithMyMemory } from "../app/utils/translate";
import { TRANSLATORS } from "../shared/translation";

describe("translateWithMyMemory", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns a disclaimer when MyMemory returns the same word untranslated", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        responseData: { translatedText: "hotel" },
        responseStatus: 200,
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await translateWithMyMemory("hotel");

    expect(result.translation).toBe("hotel");
    expect(result.disclaimer).toBe(
      "Este traductor gratuito a veces puede fallar."
    );
    expect(result.error).toBeUndefined();
  });

  it("returns a disclaimer for a normal translation too", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        responseData: { translatedText: "hola" },
        responseStatus: 200,
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await translateWithMyMemory("hello");

    expect(result.translation).toBe("hola");
    expect(result.disclaimer).toBe(
      "Este traductor gratuito a veces puede fallar."
    );
  });

  it("returns a quota error without a disclaimer when MyMemory is exhausted", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        responseData: { translatedText: "hola" },
        responseStatus: 429,
        responseDetails: "Daily limit exceeded",
        quotaFinished: true,
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await translateWithMyMemory("hello");

    expect(result.translation).toBe("");
    expect(result.error).toBe("MYMEMORY_QUOTA_EXCEEDED");
    expect(result.disclaimer).toBeUndefined();
  });

  it("propagates the disclaimer when Chrome falls back to MyMemory", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        responseData: { translatedText: "hola" },
        responseStatus: 200,
      }),
    }));

    const result = await translateTerm("hello", TRANSLATORS.CHROME);

    expect(result.translation).toBe("hola");
    expect(result.disclaimer).toBe(
      "Este traductor gratuito a veces puede fallar."
    );
    expect(result.error).toBeUndefined();
  });
});
