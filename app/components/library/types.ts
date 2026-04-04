import type { Folder, TextItem } from "~/types";

export interface LibraryMessage {
  type: "success" | "error";
  text: string;
}

export interface TextGroup {
  folder: Folder | null;
  texts: TextItem[];
}
