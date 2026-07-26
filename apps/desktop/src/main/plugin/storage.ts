import { databaseManager } from '../database';
import { PluginStorage } from '../database/schema/plugin-storage.entity';

export async function get(pluginId: string, key: string): Promise<string | null> {
  const repo = databaseManager.getRepository(PluginStorage);
  const item = await repo.findOne({ where: { pluginId, key } });
  return item ? JSON.parse(item.value) : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function set(pluginId: string, key: string, value: any): Promise<void> {
  const repo = databaseManager.getRepository(PluginStorage);
  await repo.save({
    pluginId,
    key,
    value: JSON.stringify(value),
  });
}
