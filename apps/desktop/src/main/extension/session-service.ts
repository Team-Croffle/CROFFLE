import { logger } from '../logger';

const storage: Map<string, Map<string, unknown>> = new Map();

export function getStore(
  extensionId: string,
  autoCreate = false,
): Map<string, unknown> | undefined {
  if (!storage.has(extensionId)) {
    if (autoCreate) {
      storage.set(extensionId, new Map());
    } else {
      return undefined;
    }
  }
  return storage.get(extensionId)!;
}

export function setItem(extensionId: string, key: string, value: unknown): void {
  const store = getStore(extensionId, true)!;
  store.set(key, value);
  logger.info('PluginSession', `Set: [${extensionId}] ${key}`);
}

export function getItem<T = unknown>(extensionId: string, key: string): T | null {
  const store = getStore(extensionId, false);
  if (!store) {
    return null;
  }
  if (!store.has(key)) {
    return null;
  }
  return store.get(key) as T;
}

export function deleteItem(extensionId: string, key: string): boolean {
  const store = getStore(extensionId, false);
  if (!store) {
    return false;
  }
  const result = store.delete(key);
  if (result) {
    logger.info('PluginSession', `Delete: [${extensionId}] ${key}`);
  }
  return result;
}

export function clearItem(extensionId: string): void {
  if (storage.has(extensionId)) {
    storage.delete(extensionId);
    logger.info('PluginSession', `Cleared: [${extensionId}]`);
  }
}

export function clearAllItems(): void {
  storage.clear();
  logger.info('PluginSession', `Cleared all plugin sessions`);
}
