import { AppEventType } from '@croffledev/common';
import { ipcMain } from 'electron';

import { eventService } from '../event-bus/event-service';
import { get, set } from '../extension/storage';

export const registerExtensionStorageIpcHandlers = () => {
  ipcMain.handle('app:storage:get', async (_, { extensionId, key }) => {
    // Add app event emit
    eventService.emit(AppEventType.EXTENSION_STORAGE_GET, extensionId, key);

    return await get(extensionId, key);
  });
  ipcMain.handle('app:storage:set', async (_, { extensionId, key, value }) => {
    // Add app event emit
    eventService.emit(AppEventType.EXTENSION_STORAGE_SET, extensionId, key, value);

    await set(extensionId, key, value);
  });
};
