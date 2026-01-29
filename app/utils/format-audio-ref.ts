import type { AudioRef } from "~/types";

export const formatAudioRef = async (audioRef: AudioRef | null) => {
  if (!audioRef) return null;

  if (audioRef.type === "url") {
    // URL audio - return directly
    return audioRef.url;
  }

  if (audioRef.type === "file") {
    // File audio - need to get file handle and create object URL
    // Check if fileHandle exists (it may not if restored from DB)
    if (!audioRef.fileHandle) {
      // FileHandle was not persisted - user needs to reauthorize
      console.warn(
        "[Audio] FileHandle not available - requires reauthorization"
      );
      return null;
    }
    try {
      const file = await audioRef.fileHandle.getFile();
      const url = URL.createObjectURL(file);
      return url;
    } catch (e) {
      // No permission or failed to read file. We'll allow reauthorization in the Reader.
      console.warn("[Audio] Failed to read file:", e);
      return null;
    }
  }

  return null;
};
