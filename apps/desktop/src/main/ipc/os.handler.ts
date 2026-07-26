import type { ClipboardResult } from '@croffledev/croffle-types';
import { ipcMain } from 'electron';

import { getClipboard, setClipboard } from '../window/clipboard';
import { showNotification } from '../window/os-notification';

export const registerOsIpcHandlers = (): void => {
  ipcMain.handle('os:showNotification', (_, title, body) => {
    return showNotification(title, body);
  });

  ipcMain.handle('os:getClipboard', (): ClipboardResult => {
    return getClipboard();
  });

  ipcMain.handle(
    'os:setClipboard',
    (_, data: { type: 'text'; value: string } | { type: 'image'; value: Buffer }): void => {
      setClipboard(data);
    },
  );
};
