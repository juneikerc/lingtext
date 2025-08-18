export async function translate(term: string): Promise<string> {
  if ("Translator" in self) {
    const translateWithChromeAPI = async () => {
      try {
        // @ts-expect-error Translator is a new Chrome API not in TS types yet
        const translator = await Translator.create({
          sourceLanguage: "en",
          targetLanguage: "es",
        });
        const result = await translator.translate(term);
        return result;
      } catch (error) {
        console.error("Chrome Translation API error:", error);
        return "Translation failed.";
      }
    };

    return translateWithChromeAPI();
  } else {
    return "";
  }
}
