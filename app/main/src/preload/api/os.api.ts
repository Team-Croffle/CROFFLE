import { ipcRenderer } from 'electron';
import type { ClipboardResult } from '../../core/native-os/service/OSService';

export const osApi = {
  os: {
    showNotification: (title: string, body: string): Promise<void> =>
      ipcRenderer.invoke('os:showNotification', title, body),

    getClipboard: (): Promise<ClipboardResult> =>
      ipcRenderer.invoke('os:getClipboard'),

    setClipboard: (
      data:
        | { type: 'text'; value: string }
        | { type: 'image'; value: Buffer }
    ): Promise<void> =>
      ipcRenderer.invoke('os:setClipboard', data),
  },
};
