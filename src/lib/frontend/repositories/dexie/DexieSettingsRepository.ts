import type { SettingsRepositoryPort } from "#lib/frontend/ports/SettingsRepository.js";
import { db } from "#lib/frontend/services/db/index.js";
import type { SettingRecord } from "#lib/frontend/services/db/schema/index.js";

export class DexieSettingsRepository implements SettingsRepositoryPort {
  async get(key: SettingRecord["key"]) {
    return db.settings.get(key);
  }
  async set(key: SettingRecord["key"], value: number): Promise<void> {
    await db.settings.put({ key, value });
  }
}
