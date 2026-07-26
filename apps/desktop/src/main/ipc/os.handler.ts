import { ipcMain } from 'electron';
import { showNotification } from '../window/os-notification';
import { getClipboard, setClipboard } from '../window/clipboard';
import type { ClipboardResult } from '@croffledev/croffle-types';
import { eventService } from '../event-bus/event-service';
import { AppEventType } from '@croffledev/shared';

export const registerOsIpcHandlers = (): void => {
  // 1. 알림
  ipcMain.handle('os:showNotification', (_, title, body) => {
    const result = showNotification(title, body);

    // Add app event emit
    eventService.emit(AppEventType.NATIVE_OS_NOTIFICATION, title, body);

    return result;
  });

  // 2. 클립보드 읽기
  ipcMain.handle('os:getClipboard', (): ClipboardResult => {
    const result = getClipboard();

    // Add app event emit
    eventService.emit(AppEventType.NATIVE_OS_CLIPBOARD_GET, result);

    return result;
  });

  // 3. 클립보드 쓰기
  ipcMain.handle(
    'os:setClipboard',
    (_, data: { type: 'text'; value: string } | { type: 'image'; value: Buffer }): void => {
      setClipboard(data);

      // Add app event emit
      eventService.emit(AppEventType.NATIVE_OS_CLIPBOARD_SET, data);
    },
  );
};
