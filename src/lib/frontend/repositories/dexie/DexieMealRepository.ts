import type { MealRepositoryPort } from "#lib/frontend/ports/MealRepository.js";
import { db } from "#lib/frontend/services/db/index.js";
import type { MealType } from "#lib/frontend/services/db/schema/index.js";

export class DexieMealRepository implements MealRepositoryPort {
  async createMeal(data: MealType): Promise<void> {
    await db.transaction("rw", db.mealTypes, async () => {
      if (await db.mealTypes.get(data.id)) throw new Error("Meal type already exists");
      await db.mealTypes.put(data);
    });
  }

  async updateMeal(data: MealType): Promise<void> {
    await db.transaction("rw", db.mealTypes, async () => {
      if (!(await db.mealTypes.get(data.id))) throw new Error("Meal type not found");
      await db.mealTypes.put(data);
    });
  }

  async getMeal(id: string) {
    return db.mealTypes.get(id);
  }
  async getMeals() {
    return db.mealTypes.toArray();
  }

  async deleteMeal(id: string): Promise<void> {
    await db.transaction("rw", db.mealTypes, async () => {
      await db.mealTypes.delete(id);
    });
  }
}
