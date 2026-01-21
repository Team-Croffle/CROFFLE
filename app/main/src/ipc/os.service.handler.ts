import { ipcMain } from 'electron';
import { osService } from '../core/native-os/service/OSService';
import type { ClipboardResult } from '../core/native-os/service/OSService'; // export 필요

export const registerOsIpcHandlers = (): void => {
  // 1. 알림
  ipcMain.handle(
    'os:showNotification',
    async (_, title: string, body: string): Promise<void> => {
      osService.showNotification(title, body);
    }
  );

  // 2. 클립보드 읽기
  ipcMain.handle(
    'os:getClipboard',
    (): ClipboardResult => {
      return osService.getClipboard();
    }
  );

  // 3. 클립보드 쓰기
  ipcMain.handle(
    'os:setClipboard',
    (
      _,
      data:
        | { type: 'text'; value: string }
        | { type: 'image'; value: Buffer }
    ): void => {
      osService.setClipboard(data);
    }
  );
};
