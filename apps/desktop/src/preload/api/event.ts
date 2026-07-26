import type { EventApi } from '@croffledev/croffle-types';
import type { IpcRendererEvent } from 'electron';
import { ipcRenderer } from 'electron';

export const eventApi = {
  emit: (eventName: string, ...args: unknown[]) => {
    ipcRenderer.send('event:emit', eventName, ...args);
  },

  on: (eventName: string, callback: (...args: unknown[]) => void) => {
    const subscription = (_: IpcRendererEvent, eventType: string, ...args: unknown[]) => {
      if (eventType === eventName) {
        callback(...args);
      }
    };

    ipcRenderer.on('croffle:app:event', subscription);

    return () => {
      ipcRenderer.off('croffle:app:event', subscription);
    };
  },
} satisfies EventApi;
