import { AppEventType } from '@croffledev/common';
import { ipcMain } from 'electron';

import { eventService } from '../event-bus/event-service';
import { logger } from '../logger';
import { getItem, setItem, deleteItem, clearItem, clearAllItems } from '../plugin/session-service';

const validateArgs = (
  payload: unknown,
  requireKey: boolean = true,
): { pluginId: string; key?: string; value?: unknown } => {
  // payload가 비어있거나 객체가 아니면 에러
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload');
  }

  // 객체임이 확인되었으므로 안전하게 Record로 캐스팅
  const data = payload as Record<string, unknown>;
  const { pluginId, key, value } = data;

  if (typeof pluginId !== 'string' || pluginId.trim() === '') {
    throw new Error('Invalid pluginId');
  }
  if (requireKey && (typeof key !== 'string' || key.trim() === '')) {
    throw new Error('Invalid key');
  }

  return {
    pluginId,
    key: key as string | undefined,
    value,
  };
};

export const registerPluginSessionIpcHandlers = () => {
  ipcMain.handle('sessionStorage:get', async (_, payload: unknown = {}) => {
    try {
      const { pluginId, key } = validateArgs(payload, true);
      const value = getItem(pluginId, key as string);
      eventService.emit(AppEventType.PLUGIN_SESSION_STORAGE_GET, { pluginId, key });
      return value;
    } catch (error) {
      logger.error('PluginSession', 'Get error:', error);
      throw error;
    }
  });

  ipcMain.handle('sessionStorage:set', async (_, payload: unknown = {}) => {
    try {
      const { pluginId, key, value } = validateArgs(payload, true);
      setItem(pluginId, key as string, value);
      eventService.emit(AppEventType.PLUGIN_SESSION_STORAGE_SET, { pluginId, key });
    } catch (error) {
      logger.error('PluginSession', 'Set error:', error);
      throw error;
    }
  });

  ipcMain.handle('sessionStorage:delete', async (_, payload: unknown = {}) => {
    try {
      const { pluginId, key } = validateArgs(payload, true);
      const result = deleteItem(pluginId, key as string);
      eventService.emit(AppEventType.PLUGIN_SESSION_STORAGE_DELETE, { pluginId, key, result });
      return result;
    } catch (error) {
      logger.error('PluginSession', 'Delete error:', error);
      throw error;
    }
  });

  ipcMain.handle('sessionStorage:clear', async (_, payload: unknown = {}) => {
    try {
      const { pluginId } = validateArgs(payload, false);
      clearItem(pluginId);
      eventService.emit(AppEventType.PLUGIN_SESSION_STORAGE_CLEAR, { pluginId });
    } catch (error) {
      logger.error('PluginSession', 'Clear error:', error);
      throw error;
    }
  });

  ipcMain.handle('sessionStorage:clearAll', async () => {
    try {
      clearAllItems();
      eventService.emit(AppEventType.PLUGIN_SESSION_STORAGE_CLEAR_ALL, {});
    } catch (error) {
      logger.error('PluginSession', 'ClearAll error:', error);
      throw error;
    }
  });
};
