import Dexie, { type EntityTable } from "dexie";

import type {
  CalorieRecord,
  WeightRecord,
  SettingRecord,
  DailyMeal,
  MealType,
} from "./schema/index.js";

export const db = new Dexie("KcalTrackerDatabase") as Dexie & {
  calorieRecords: EntityTable<CalorieRecord, "id">;
  weightRecords: EntityTable<WeightRecord, "id">;
  settings: EntityTable<SettingRecord, "key">;
  dailyMeals: EntityTable<DailyMeal, "id">;
  mealTypes: EntityTable<MealType, "id">;
};

db.version(1).stores({
  calorieRecords: "id, date",
  weightRecords: "id, date",
  dailyMeals: "id, date",
  mealTypes: "id",
  settings: "key, value",
});
