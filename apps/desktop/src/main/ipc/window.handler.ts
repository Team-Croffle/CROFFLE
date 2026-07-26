import type { IpcMainInvokeEvent } from 'electron';
import { BrowserWindow, ipcMain } from 'electron';
import { windowService } from '../window/window-service';
import { eventService } from '../event-bus/event-service';
import { AppEventType } from '@croffledev/shared';
import { logger } from '../logger';

const validateSender = (event: IpcMainInvokeEvent): BrowserWindow => {
  const window = BrowserWindow.fromWebContents(event.sender);
  const frameUrl = event.senderFrame?.url || '';

  if (!window) {
    throw new Error('[Security] Request from unknown window.');
  }

  const isSafeOrigin =
    frameUrl?.startsWith('file://') || frameUrl === '' || /^http:\/\/localhost:\d+/.test(frameUrl);

  if (!isSafeOrigin) {
    logger.error('Security', `Blocked IPC from unauthorized origin: ${frameUrl}`);
    throw new Error('Unauthorized IPC sender');
  }
  return window;
};

export function registerWindowIpcHandlers() {
  ipcMain.handle('window:minimize', (event) => {
    const window = validateSender(event);
    window.minimize();

    // Add app event emit
    eventService.emit(AppEventType.WINDOW_MINIMIZE);
  });

  ipcMain.handle('window:maximize', (event) => {
    const window = validateSender(event);
    if (window.isMaximized()) {
      window.unmaximize();

      // Add app event emit
      eventService.emit(AppEventType.WINDOW_RESTORE);
    } else {
      window.maximize();

      // Add app event emit
      eventService.emit(AppEventType.WINDOW_MAXIMIZE);
    }
  });

  ipcMain.handle('window:close', (event) => {
    const window = validateSender(event);
    window.close();

    // Add app event emit
    eventService.emit(AppEventType.WINDOW_CLOSE);
  });

  ipcMain.handle('window:exitApp', (event) => {
    validateSender(event);
    windowService.exitApp();
  });

  ipcMain.handle('window:checkForUpdates', async (event) => {
    const window = validateSender(event);
    await windowService.checkForUpdates();

    // Add app event emit
    eventService.emit(AppEventType.WINDOW_CHECK_FOR_UPDATES, window.id);
  });

  ipcMain.handle('window:setCloseToTrayMode', (event, enabled: boolean) => {
    validateSender(event);
    windowService.setCloseToTrayMode(enabled);
  });
}
