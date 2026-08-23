import type { WeightRecord } from "../services/db/schema/index.js";

export interface WeightRepositoryPort {
  createWeight(data: WeightRecord): Promise<void>;
  updateWeight(data: WeightRecord): Promise<void>;
  getWeight(id: string): Promise<WeightRecord | undefined>;
  getAllWeights(): Promise<WeightRecord[]>;
  deleteWeight(id: string): Promise<void>;
}
