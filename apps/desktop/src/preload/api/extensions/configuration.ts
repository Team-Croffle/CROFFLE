import type { ExtensionConfigurationApi } from '@croffledev/croffle-types';
import { ipcRenderer } from 'electron';

const DEFAULT_STORAGE_KEY = '__croffle_configuration__';

export const extensionConfigurationApi = {
  get: async <T = Record<string, unknown>>(
    extensionId: string,
    storageKey = DEFAULT_STORAGE_KEY,
  ): Promise<T> => {
    const raw = await ipcRenderer.invoke('app:storage:get', { extensionId, key: storageKey });
    if (!raw) {
      return {} as T;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return {} as T;
    }
  },
  set: async (
    extensionId: string,
    values: Record<string, unknown>,
    storageKey = DEFAULT_STORAGE_KEY,
  ): Promise<void> => {
    await ipcRenderer.invoke('app:storage:set', {
      extensionId,
      key: storageKey,
      value: JSON.stringify(values),
    });
  },
} satisfies ExtensionConfigurationApi;
