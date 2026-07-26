import { databaseManager } from '../database';
import { ExtensionStorage } from '../database/schema/extension-storage.entity';

export async function get<T = unknown>(extensionId: string, key: string): Promise<T | null> {
  const repo = databaseManager.getRepository(ExtensionStorage);
  const item = await repo.findOne({ where: { extensionId, key } });
  if (!item) {
    return null;
  }

  try {
    return JSON.parse(item.value) as T;
  } catch {
    return null;
  }
}

export async function set(extensionId: string, key: string, value: unknown): Promise<void> {
  const repo = databaseManager.getRepository(ExtensionStorage);
  await repo.save({
    extensionId,
    key,
    value: JSON.stringify(value),
  });
}
