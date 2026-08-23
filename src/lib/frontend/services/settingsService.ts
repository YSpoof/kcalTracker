import type { SettingsRepositoryPort } from "#lib/frontend/ports/SettingsRepository.js";
import { settingsRepository } from "#lib/frontend/repositories/index.js";

const DEFAULTS = {
  dailyCalorieGoal: 2000,
  weightGoal: 70,
} as const;

export class SettingsService {
  constructor(private settingsRepo: SettingsRepositoryPort = settingsRepository) {}

  async getCalorieGoal(): Promise<number> {
    const record = await this.settingsRepo.get("dailyCalorieGoal");
    return record?.value ?? DEFAULTS.dailyCalorieGoal;
  }

  async setCalorieGoal(value: number): Promise<void> {
    await this.settingsRepo.set("dailyCalorieGoal", value);
  }

  async getWeightGoal(): Promise<number> {
    const record = await this.settingsRepo.get("weightGoal");
    return record?.value ?? DEFAULTS.weightGoal;
  }

  async setWeightGoal(value: number): Promise<void> {
    await this.settingsRepo.set("weightGoal", value);
  }
}

export const settingsService = new SettingsService();
