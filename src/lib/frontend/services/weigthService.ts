import type { WeightRepositoryPort } from "#lib/frontend/ports/WeightRepository.js";
import { weightRepository } from "#lib/frontend/repositories/index.js";

import type { WeightRecord } from "./db/schema/weight.schema.js";

export class WeightService {
  constructor(private weightRepo: WeightRepositoryPort = weightRepository) {}

  async createWeight(data: WeightRecord) {
    return this.weightRepo.createWeight(data);
  }
  async updateWeight(data: WeightRecord) {
    return this.weightRepo.updateWeight(data);
  }
  async getWeight(id: string) {
    return this.weightRepo.getWeight(id);
  }
  async getWeights() {
    return this.weightRepo.getAllWeights();
  }
  async deleteWeight(id: string) {
    return this.weightRepo.deleteWeight(id);
  }
}

export const weightService = new WeightService();
