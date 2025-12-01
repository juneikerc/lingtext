import { getAllUnknownWords } from "../services/db";

function toCsvCell(s: string): string {
  // escape quotes and wrap in quotes
  const escaped = s.replace(/"/g, '""');
  return '"' + escaped + '"';
}

export async function exportUnknownWordsCsv(
  filename = "ling-text-words.csv"
): Promise<void> {
  const words = await getAllUnknownWords();
  // Columns: Expression (word), Meaning (translation)
  const header = ["Expression", "Meaning"];
  const lines = [header.map(toCsvCell).join(",")];
  for (const w of words) {
    const row = [w.word, w.translation || ""];
    lines.push(row.map(toCsvCell).join(","));
  }
  const content = lines.join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
