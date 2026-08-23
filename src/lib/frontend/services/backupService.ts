import { db } from "#lib/frontend/services/db/index.js";
import type {
  CalorieRecord,
  DailyMeal,
  MealType,
  SettingRecord,
  WeightRecord,
} from "#lib/frontend/services/db/schema/index.js";
import { getToday } from "#lib/frontend/utils/date.js";
import { cloneObject } from "#lib/frontend/utils/generics.js";

export const BACKUP_VERSION = 1;

export interface BackupPayload {
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  data: {
    mealTypes: MealType[];
    dailyMeals: DailyMeal[];
    weightRecords: WeightRecord[];
    settings: SettingRecord[];
    calorieRecords: CalorieRecord[];
  };
}

const isBackupPayload = (value: unknown): boolean => {
  if (!value || typeof value !== "object") return false;

  const backup = value as BackupPayload;
  if (backup.version !== BACKUP_VERSION) return false;
  if (typeof backup.exportedAt !== "string") return false;
  if (!backup.data || typeof backup.data !== "object") return false;

  const { data } = backup;
  return (
    Array.isArray(data.mealTypes) &&
    Array.isArray(data.dailyMeals) &&
    Array.isArray(data.weightRecords) &&
    Array.isArray(data.settings) &&
    Array.isArray(data.calorieRecords)
  );
};

export class BackupService {
  async createBackup(): Promise<BackupPayload> {
    const [mealTypes, dailyMeals, weightRecords, settings, calorieRecords] = await Promise.all([
      db.mealTypes.toArray(),
      db.dailyMeals.toArray(),
      db.weightRecords.toArray(),
      db.settings.toArray(),
      db.calorieRecords.toArray(),
    ]);

    return {
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      data: {
        mealTypes,
        dailyMeals,
        weightRecords,
        settings,
        calorieRecords,
      },
    };
  }

  parseBackup(raw: string): BackupPayload {
    let parsed: BackupPayload;

    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("Arquivo de backup inválido.");
    }

    if (!isBackupPayload(parsed)) {
      throw new Error("Arquivo de backup inválido ou incompatível.");
    }

    return parsed;
  }

  async restoreBackup(backup: BackupPayload): Promise<void> {
    const { mealTypes, dailyMeals, weightRecords, settings, calorieRecords } = cloneObject(
      backup.data,
    );

    await db.transaction(
      "rw",
      [db.mealTypes, db.dailyMeals, db.weightRecords, db.settings, db.calorieRecords],
      async () => {
        await Promise.all([
          db.mealTypes.clear(),
          db.dailyMeals.clear(),
          db.weightRecords.clear(),
          db.settings.clear(),
          db.calorieRecords.clear(),
        ]);

        await Promise.all([
          db.mealTypes.bulkAdd(mealTypes),
          db.dailyMeals.bulkAdd(dailyMeals),
          db.weightRecords.bulkAdd(weightRecords),
          db.settings.bulkAdd(settings),
          db.calorieRecords.bulkAdd(calorieRecords),
        ]);
      },
    );
  }

  downloadBackup(backup: BackupPayload): void {
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kcal-tracker-backup-${getToday()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export const backupService = new BackupService();
