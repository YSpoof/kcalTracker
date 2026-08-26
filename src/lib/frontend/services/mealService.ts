import type { DailyMealRepositoryPort } from "#lib/frontend/ports/DailyMealRepository.js";
import type { MealRepositoryPort } from "#lib/frontend/ports/MealRepository.js";
import { mealRepository, dailyMealRepository } from "#lib/frontend/repositories/index.js";

import type { MealType, DailyMeal } from "./db/schema/index.js";

export class MealService {
  constructor(
    private mealRepo: MealRepositoryPort = mealRepository,
    private dailyMealRepo: DailyMealRepositoryPort = dailyMealRepository,
  ) {}

  async createMeal(data: MealType) {
    return this.mealRepo.createMeal(data);
  }
  async updateMeal(data: MealType) {
    return this.mealRepo.updateMeal(data);
  }
  async getMeal(id: string) {
    return this.mealRepo.getMeal(id);
  }
  async getMeals() {
    return this.mealRepo.getMeals();
  }
  async deleteMeal(id: string) {
    return this.mealRepo.deleteMeal(id);
  }

  async createDailyMeal(data: DailyMeal) {
    return this.dailyMealRepo.createDailyMeal(data);
  }
  async updateDailyMeal(data: DailyMeal) {
    return this.dailyMealRepo.updateDailyMeal(data);
  }
  async getDailyMeal(id: string) {
    return this.dailyMealRepo.getDailyMeal(id);
  }
  async getDailyMeals(date: string) {
    return this.dailyMealRepo.getDailyMeals(date);
  }
  async getDailyMealsByDateRange(startDate: string, endDate: string) {
    return this.dailyMealRepo.getDailyMealsByDateRange(startDate, endDate);
  }
  async deleteDailyMeal(id: string) {
    return this.dailyMealRepo.deleteDailyMeal(id);
  }
}

export const mealService = new MealService();
