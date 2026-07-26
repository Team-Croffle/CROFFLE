import type { ExtensionSessionApi } from '@croffledev/croffle-types';
import { ipcRenderer } from 'electron';

export const extensionSessionApi = {
  get: <T = unknown>(extensionId: string, key: string): Promise<T | null> => {
    return ipcRenderer.invoke('sessionStorage:get', { extensionId, key });
  },
  set: <T = unknown>(extensionId: string, key: string, value: T): Promise<void> => {
    return ipcRenderer.invoke('sessionStorage:set', { extensionId, key, value });
  },

  delete: (extensionId: string, key: string): Promise<boolean> => {
    return ipcRenderer.invoke('sessionStorage:delete', { extensionId, key });
  },

  clear: (extensionId: string): Promise<void> => {
    return ipcRenderer.invoke('sessionStorage:clear', { extensionId });
  },

  clearAll: (): Promise<void> => {
    return ipcRenderer.invoke('sessionStorage:clearAll');
  },
} satisfies ExtensionSessionApi;
