import type { MealType } from "../services/db/schema/index.js";

export interface MealRepositoryPort {
  createMeal(data: MealType): Promise<void>;
  updateMeal(data: MealType): Promise<void>;
  getMeal(id: string): Promise<MealType | undefined>;
  getMeals(): Promise<MealType[]>;
  deleteMeal(id: string): Promise<void>;
}
