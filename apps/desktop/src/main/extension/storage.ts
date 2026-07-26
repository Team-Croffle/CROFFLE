import { databaseManager } from '../database';
import { ExtensionStorage } from '../database/schema/extension-storage.entity';

export async function get(extensionId: string, key: string): Promise<string | null> {
  const repo = databaseManager.getRepository(ExtensionStorage);
  const item = await repo.findOne({ where: { extensionId, key } });
  return item ? JSON.parse(item.value) : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function set(extensionId: string, key: string, value: any): Promise<void> {
  const repo = databaseManager.getRepository(ExtensionStorage);
  await repo.save({
    extensionId,
    key,
    value: JSON.stringify(value),
  });
}
