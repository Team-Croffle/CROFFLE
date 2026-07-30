import { and, eq } from 'drizzle-orm';

import { databaseManager } from '../database';
import { extensionStorage } from '../database/schema';

export async function get<T = unknown>(extensionId: string, key: string): Promise<T | null> {
  const db = databaseManager.getDb();
  const item = await db.query.extensionStorage.findFirst({
    where: and(eq(extensionStorage.extensionId, extensionId), eq(extensionStorage.key, key)),
  });
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
  const db = databaseManager.getDb();
  const now = new Date();
  await db
    .insert(extensionStorage)
    .values({
      extensionId,
      key,
      value: JSON.stringify(value),
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [extensionStorage.extensionId, extensionStorage.key],
      set: {
        value: JSON.stringify(value),
        updatedAt: now,
      },
    });
}

export async function remove(extensionId: string, key: string): Promise<boolean> {
  const db = databaseManager.getDb();
  const result = await db
    .delete(extensionStorage)
    .where(and(eq(extensionStorage.extensionId, extensionId), eq(extensionStorage.key, key)))
    .returning();
  return result.length > 0;
}

export async function clear(extensionId: string): Promise<void> {
  const db = databaseManager.getDb();
  await db.delete(extensionStorage).where(eq(extensionStorage.extensionId, extensionId));
}
