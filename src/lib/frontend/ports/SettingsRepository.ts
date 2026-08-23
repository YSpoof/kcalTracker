import type { SettingRecord } from "../services/db/schema/index.js";

export interface SettingsRepositoryPort {
  get(key: SettingRecord["key"]): Promise<SettingRecord | undefined>;
  set(key: SettingRecord["key"], value: number): Promise<void>;
}
