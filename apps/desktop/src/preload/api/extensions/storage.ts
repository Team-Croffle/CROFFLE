import type { ExtensionStorageApi } from '@croffledev/croffle-types';
import { ipcRenderer } from 'electron';

export const extensionStorageApi = {
  get: <T = unknown>(extensionId: string, key: string): Promise<T | null> => {
    return ipcRenderer.invoke('app:storage:get', { extensionId, key });
  },
  set: (extensionId: string, key: string, value: unknown): Promise<void> => {
    return ipcRenderer.invoke('app:storage:set', { extensionId, key, value });
  },
} satisfies ExtensionStorageApi;
