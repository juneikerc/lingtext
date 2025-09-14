type OpenFilePickerOptions = {
  multiple?: boolean;
  types?: Array<{
    description?: string;
    accept: Record<string, string[]>;
  }>;
};

export async function pickAudioFile(): Promise<FileSystemFileHandle | null> {
  const hasPicker =
    typeof window !== "undefined" && "showOpenFilePicker" in window;
  if (!hasPicker) {
    alert(
      "Tu navegador no soporta el selector de archivos (File System Access API). Usa URL de audio."
    );
    return null;
  }
  const anyWin = window as unknown as {
    showOpenFilePicker?: (
      options?: OpenFilePickerOptions
    ) => Promise<FileSystemFileHandle[]>;
  };
  const [handle] = await (
    anyWin.showOpenFilePicker as NonNullable<typeof anyWin.showOpenFilePicker>
  )({
    multiple: false,
    types: [
      {
        description: "Audio Files",
        accept: { "audio/*": [".mp3", ".m4a", ".ogg", ".wav"] },
      },
    ],
  });

  return handle ?? null;
}

export async function ensureReadPermission(
  handle: FileSystemFileHandle
): Promise<boolean> {
  try {
    const anyHandle = handle as unknown as {
      queryPermission?: (opts?: {
        mode?: "read" | "readwrite";
      }) => Promise<"granted" | "denied" | "prompt">;
      requestPermission?: (opts?: {
        mode?: "read" | "readwrite";
      }) => Promise<"granted" | "denied" | "prompt">;
    };
    const q = await anyHandle.queryPermission?.({ mode: "read" });
    if (q === "granted") return true;
    const r = await anyHandle.requestPermission?.({ mode: "read" });
    return r === "granted";
  } catch {
    return false;
  }
}
