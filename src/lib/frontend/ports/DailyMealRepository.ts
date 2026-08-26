import type { DailyMeal } from "../services/db/schema/index.js";

export interface DailyMealRepositoryPort {
  createDailyMeal(data: DailyMeal): Promise<void>;
  updateDailyMeal(data: DailyMeal): Promise<void>;
  getDailyMeal(id: string): Promise<DailyMeal | undefined>;
  getDailyMeals(date: string): Promise<DailyMeal[]>;
  getDailyMealsByDateRange(startDate: string, endDate: string): Promise<DailyMeal[]>;
  deleteDailyMeal(id: string): Promise<void>;
}
