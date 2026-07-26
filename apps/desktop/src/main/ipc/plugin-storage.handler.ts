import { AppEventType } from '@croffledev/common';
import { ipcMain } from 'electron';

import { eventService } from '../event-bus/event-service';
import { get, set } from '../plugin/storage';

export const registerPluginStorageIpcHandlers = () => {
  ipcMain.handle('app:storage:get', async (_, { pluginId, key }) => {
    // Add app event emit
    eventService.emit(AppEventType.PLUGIN_STORAGE_GET, pluginId, key);

    return await get(pluginId, key);
  });
  ipcMain.handle('app:storage:set', async (_, { pluginId, key, value }) => {
    // Add app event emit
    eventService.emit(AppEventType.PLUGIN_STORAGE_SET, pluginId, key, value);

    await set(pluginId, key, value);
  });
};
