import type { PluginSettingsApi } from '@croffledev/croffle-types';
import { ipcRenderer } from 'electron';

const DEFAULT_STORAGE_KEY = '__croffle_settings__';

export const pluginSettingsApi = {
  get: async <T = Record<string, unknown>>(
    pluginId: string,
    storageKey = DEFAULT_STORAGE_KEY,
  ): Promise<T> => {
    const raw = await ipcRenderer.invoke('app:storage:get', { pluginId, key: storageKey });
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
    pluginId: string,
    values: Record<string, unknown>,
    storageKey = DEFAULT_STORAGE_KEY,
  ): Promise<void> => {
    await ipcRenderer.invoke('app:storage:set', {
      pluginId,
      key: storageKey,
      value: JSON.stringify(values),
    });
  },
} satisfies PluginSettingsApi;
