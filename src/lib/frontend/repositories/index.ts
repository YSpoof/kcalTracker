import { DexieDailyMealRepository } from "./dexie/DexieDailyMealRepository.js";
import { DexieMealRepository } from "./dexie/DexieMealRepository.js";
import { DexieSettingsRepository } from "./dexie/DexieSettingsRepository.js";
import { DexieWeightRepository } from "./dexie/DexieWeightRepository.js";

export const mealRepository = new DexieMealRepository();
export const dailyMealRepository = new DexieDailyMealRepository();
export const weightRepository = new DexieWeightRepository();
export const settingsRepository = new DexieSettingsRepository();
