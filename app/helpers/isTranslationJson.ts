export const isTranslationJson = (translation: string): boolean => {
  try {
    const parsed = JSON.parse(translation);
    return parsed && typeof parsed === "object" && "word" in parsed;
  } catch {
    return false;
  }
};
