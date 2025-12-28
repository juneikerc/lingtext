import type { AudioRef } from "../../types";
import type { SerializedAudioRef } from "./types";

/**
 * AUDIO REF SERIALIZATION HELPERS
 */

export function serializeAudioRef(audioRef: AudioRef): SerializedAudioRef {
  if (audioRef.type === "url") {
    return { type: "url", url: audioRef.url };
  }
  // For file type, we can only store the name
  // FileHandle requires re-authorization on each session
  return { type: "file", name: audioRef.name };
}

export function deserializeAudioRef(data: SerializedAudioRef): AudioRef | null {
  if (data.type === "url" && data.url) {
    return { type: "url", url: data.url };
  }
  // File handles cannot be restored from serialization
  // The UI will need to handle re-authorization
  if (data.type === "file" && data.name) {
    // Return a partial object - the fileHandle will be undefined
    // Components should check for this and prompt re-authorization
    return {
      type: "file",
      name: data.name,
      fileHandle: undefined as unknown as FileSystemFileHandle,
    };
  }
  return null;
}
