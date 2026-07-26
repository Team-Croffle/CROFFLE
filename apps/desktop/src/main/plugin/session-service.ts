import { logger } from '../logger';

const storage: Map<string, Map<string, unknown>> = new Map();

export function getStore(pluginId: string, autoCreate = false): Map<string, unknown> | undefined {
  if (!storage.has(pluginId)) {
    if (autoCreate) {
      storage.set(pluginId, new Map());
    } else {
      return undefined;
    }
  }
  return storage.get(pluginId)!;
}

export function setItem(pluginId: string, key: string, value: unknown): void {
  const store = getStore(pluginId, true)!;
  store.set(key, value);
  logger.info('PluginSession', `Set: [${pluginId}] ${key}`);
}

export function getItem<T = unknown>(pluginId: string, key: string): T | null {
  const store = getStore(pluginId, false);
  if (!store) {
    return null;
  }
  if (!store.has(key)) {
    return null;
  }
  return store.get(key) as T;
}

export function deleteItem(pluginId: string, key: string): boolean {
  const store = getStore(pluginId, false);
  if (!store) {
    return false;
  }
  const result = store.delete(key);
  if (result) {
    logger.info('PluginSession', `Delete: [${pluginId}] ${key}`);
  }
  return result;
}

export function clearItem(pluginId: string): void {
  if (storage.has(pluginId)) {
    storage.delete(pluginId);
    logger.info('PluginSession', `Cleared: [${pluginId}]`);
  }
}

export function clearAllItems(): void {
  storage.clear();
  logger.info('PluginSession', `Cleared all plugin sessions`);
}
