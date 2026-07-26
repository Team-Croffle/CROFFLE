import type { PluginStorageApi } from '@croffledev/croffle-types';
import { ipcRenderer } from 'electron';

export const pluginStorageApi = {
  get: (pluginId: string, key: string) => {
    return ipcRenderer.invoke('app:storage:get', { pluginId, key });
  },
  set: (pluginId: string, key: string, value: string) => {
    return ipcRenderer.invoke('app:storage:set', { pluginId, key, value });
  },
} satisfies PluginStorageApi;
