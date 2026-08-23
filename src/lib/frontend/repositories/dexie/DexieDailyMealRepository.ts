import type { DailyMealRepositoryPort } from "#lib/frontend/ports/DailyMealRepository.js";
import { db } from "#lib/frontend/services/db/index.js";
import type { DailyMeal } from "#lib/frontend/services/db/schema/index.js";

export class DexieDailyMealRepository implements DailyMealRepositoryPort {
  async createDailyMeal(data: DailyMeal): Promise<void> {
    await db.transaction("rw", db.dailyMeals, async () => {
      await db.dailyMeals.put(data);
    });
  }
  async updateDailyMeal(data: DailyMeal): Promise<void> {
    await db.transaction("rw", db.dailyMeals, async () => {
      await db.dailyMeals.put(data);
    });
  }
  async getDailyMeal(id: string) {
    return db.dailyMeals.get(id);
  }
  async getDailyMeals() {
    return db.dailyMeals.toArray();
  }
  async getDailyMealsByDateRange(startDate: string, endDate: string) {
    return db.dailyMeals.where("date").between(startDate, endDate, true, true).toArray();
  }
  async deleteDailyMeal(id: string): Promise<void> {
    await db.transaction("rw", db.dailyMeals, async () => {
      await db.dailyMeals.delete(id);
    });
  }
}
