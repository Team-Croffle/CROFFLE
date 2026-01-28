import { ipcMain } from 'electron';
import { osService } from '../core/native-os/service/nativeOsService';
import type { ClipboardResult } from '../core/native-os/service/nativeOsService';

export const registerOsIpcHandlers = (): void => {
  // 1. 알림
  ipcMain.handle('os:showNotification', (_, title, body) => {
    osService.showNotification(title, body);
    return;
  });

  // 2. 클립보드 읽기
  ipcMain.handle('os:getClipboard', (): ClipboardResult => {
    return osService.getClipboard();
  });

  // 3. 클립보드 쓰기
  ipcMain.handle(
    'os:setClipboard',
    (_, data: { type: 'text'; value: string } | { type: 'image'; value: Buffer }): void => {
      osService.setClipboard(data);
    }
  );
};
