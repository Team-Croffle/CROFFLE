import { AppEventType } from '@croffledev/common';
import { ipcMain } from 'electron';

import { eventService } from '../event-bus/event-service';
import {
  getItem,
  setItem,
  deleteItem,
  clearItem,
  clearAllItems,
} from '../extension/session-service';
import { logger } from '../logger';

const validateArgs = (
  payload: unknown,
  requireKey: boolean = true,
): { extensionId: string; key?: string; value?: unknown } => {
  // payload가 비어있거나 객체가 아니면 에러
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload');
  }

  // 객체임이 확인되었으므로 안전하게 Record로 캐스팅
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
      const value = getItem(extensionId, key as string);
      eventService.emit(AppEventType.EXTENSION_SESSION_STORAGE_GET, { extensionId, key });
      return value;
    } catch (error) {
      logger.error('PluginSession', 'Get error:', error);
      throw error;
    }
  });

  ipcMain.handle('sessionStorage:set', async (_, payload: unknown = {}) => {
    try {
      const { extensionId, key, value } = validateArgs(payload, true);
      setItem(extensionId, key as string, value);
      eventService.emit(AppEventType.EXTENSION_SESSION_STORAGE_SET, { extensionId, key });
    } catch (error) {
      logger.error('PluginSession', 'Set error:', error);
      throw error;
    }
  });

  ipcMain.handle('sessionStorage:delete', async (_, payload: unknown = {}) => {
    try {
      const { extensionId, key } = validateArgs(payload, true);
      const result = deleteItem(extensionId, key as string);
      eventService.emit(AppEventType.EXTENSION_SESSION_STORAGE_DELETE, {
        extensionId,
        key,
        result,
      });
      return result;
    } catch (error) {
      logger.error('PluginSession', 'Delete error:', error);
      throw error;
    }
  });

  ipcMain.handle('sessionStorage:clear', async (_, payload: unknown = {}) => {
    try {
      const { extensionId } = validateArgs(payload, false);
      clearItem(extensionId);
      eventService.emit(AppEventType.EXTENSION_SESSION_STORAGE_CLEAR, { extensionId });
    } catch (error) {
      logger.error('PluginSession', 'Clear error:', error);
      throw error;
    }
  });

  ipcMain.handle('sessionStorage:clearAll', async () => {
    try {
      clearAllItems();
      eventService.emit(AppEventType.EXTENSION_SESSION_STORAGE_CLEAR_ALL, {});
    } catch (error) {
      logger.error('PluginSession', 'ClearAll error:', error);
      throw error;
    }
  });
};
