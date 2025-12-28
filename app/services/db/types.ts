/**
 * Local types for the database service
 */

export interface FilePickerOptions {
  suggestedName?: string;
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
  multiple?: boolean;
}

export interface SerializedAudioRef {
  type: "url" | "file";
  url?: string;
  name?: string;
  // FileHandle cannot be serialized, store only metadata
}
