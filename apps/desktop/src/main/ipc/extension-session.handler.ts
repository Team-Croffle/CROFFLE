import { ipcMain } from 'electron';

import { getItem, setItem, deleteItem, clearItem } from '../extension/session-service';
import { logger } from '../logger';

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

export const registerExtensionSessionIpcHandlers = () => {
  ipcMain.handle('sessionStorage:get', async (_, payload: unknown = {}) => {
    try {
      const { extensionId, key } = validateArgs(payload, true);
      return getItem(extensionId, key as string);
    } catch (error) {
      logger.error('ExtensionSession', 'Get error:', error);
      throw error;
    }
  });

  ipcMain.handle('sessionStorage:set', async (_, payload: unknown = {}) => {
    try {
      const { extensionId, key, value } = validateArgs(payload, true);
      setItem(extensionId, key as string, value);
    } catch (error) {
      logger.error('ExtensionSession', 'Set error:', error);
      throw error;
    }
  });

  ipcMain.handle('sessionStorage:delete', async (_, payload: unknown = {}) => {
    try {
      const { extensionId, key } = validateArgs(payload, true);
      return deleteItem(extensionId, key as string);
    } catch (error) {
      logger.error('ExtensionSession', 'Delete error:', error);
      throw error;
    }
  });

  ipcMain.handle('sessionStorage:clear', async (_, payload: unknown = {}) => {
    try {
      const { extensionId } = validateArgs(payload, false);
      clearItem(extensionId);
    } catch (error) {
      logger.error('ExtensionSession', 'Clear error:', error);
      throw error;
    }
  });
};
