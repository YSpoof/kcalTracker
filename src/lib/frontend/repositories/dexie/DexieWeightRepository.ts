import type { WeightRepositoryPort } from "#lib/frontend/ports/WeightRepository.js";
import { db } from "#lib/frontend/services/db/index.js";
import type { WeightRecord } from "#lib/frontend/services/db/schema/index.js";

export class DexieWeightRepository implements WeightRepositoryPort {
  async createWeight(data: WeightRecord): Promise<void> {
    await db.weightRecords.add(data);
  }
  async updateWeight(data: WeightRecord): Promise<void> {
    await db.weightRecords.update(data.id, data);
  }
  async getWeight(id: string) {
    return db.weightRecords.get(id);
  }
  async getAllWeights() {
    return db.weightRecords.toArray();
  }
  async deleteWeight(id: string): Promise<void> {
    await db.weightRecords.delete(id);
  }
}
