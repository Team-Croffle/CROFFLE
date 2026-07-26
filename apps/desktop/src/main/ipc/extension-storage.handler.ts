import { ipcMain } from 'electron';

import { get, set } from '../extension/storage';

export const registerExtensionStorageIpcHandlers = () => {
  ipcMain.handle('app:storage:get', async (_, { extensionId, key }) => {
    return await get(extensionId, key);
  });
  ipcMain.handle('app:storage:set', async (_, { extensionId, key, value }) => {
    await set(extensionId, key, value);
  });
};
