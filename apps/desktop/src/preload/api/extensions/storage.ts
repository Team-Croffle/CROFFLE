import type { ExtensionStorageApi } from '@croffledev/croffle-types';
import { ipcRenderer } from 'electron';

export const extensionStorageApi = {
  get: (extensionId: string, key: string) => {
    return ipcRenderer.invoke('app:storage:get', { extensionId, key });
  },
  set: (extensionId: string, key: string, value: string) => {
    return ipcRenderer.invoke('app:storage:set', { extensionId, key, value });
  },
} satisfies ExtensionStorageApi;
