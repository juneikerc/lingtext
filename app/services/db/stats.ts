import { getDB, scheduleSave } from "./core";

/**
 * STATS CRUD (Daily Statistics)
 */

export interface DailyStats {
  date: string; // "YYYY-MM-DD"
  newCardsStudied: number;
}

export async function getDailyStats(): Promise<DailyStats> {
  const database = await getDB();
  const today = new Date().toISOString().split("T")[0];

  const rows: Array<{
    date: string;
    new_cards_studied: number;
  }> = database.selectObjects("SELECT * FROM stats WHERE date = ?", [today]);

  if (rows.length === 0) {
    return { date: today, newCardsStudied: 0 };
  }

  return {
    date: rows[0].date,
    newCardsStudied: rows[0].new_cards_studied,
  };
}

export async function incrementNewCardsCount(): Promise<void> {
  const database = await getDB();
  const today = new Date().toISOString().split("T")[0];
  const currentStats = await getDailyStats();

  database.exec(
    "INSERT OR REPLACE INTO stats (date, new_cards_studied) VALUES (?, ?)",
    {
      bind: [today, currentStats.newCardsStudied + 1],
    }
  );
  scheduleSave();
}
