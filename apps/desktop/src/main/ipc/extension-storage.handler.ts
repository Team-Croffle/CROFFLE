import { ipcMain } from 'electron';

import { get, set, remove, clear } from '../extension/storage';

const validateArgs = (
  payload: unknown,
  requireKey: boolean = true,
): { extensionId: string; key?: string; value?: unknown } => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload');
  }

  const data = payload as Record<string, unknown>;
  const { extensionId, key, value } = data;

  if (typeof extensionId !== 'string' || extensionId.trim() === '') {
    throw new Error('Invalid extensionId');
  }
  if (requireKey && (typeof key !== 'string' || key.trim() === '')) {
    throw new Error('Invalid key');
  }

  return {
    extensionId,
    key: key as string | undefined,
    value,
  };
};

export const registerExtensionStorageIpcHandlers = () => {
  ipcMain.handle('extensionStorage:get', async (_, payload: unknown = {}) => {
    const { extensionId, key } = validateArgs(payload, true);
    return await get(extensionId, key as string);
  });

  ipcMain.handle('extensionStorage:set', async (_, payload: unknown = {}) => {
    const { extensionId, key, value } = validateArgs(payload, true);
    await set(extensionId, key as string, value);
  });

  ipcMain.handle('extensionStorage:delete', async (_, payload: unknown = {}) => {
    const { extensionId, key } = validateArgs(payload, true);
    return await remove(extensionId, key as string);
  });

  ipcMain.handle('extensionStorage:clear', async (_, payload: unknown = {}) => {
    const { extensionId } = validateArgs(payload, false);
    await clear(extensionId);
  });
};
