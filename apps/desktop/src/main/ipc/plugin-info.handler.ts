import type { PluginInfo } from '@croffledev/croffle-types';
import { AppEventType } from '@croffledev/shared';
import { ipcMain, dialog } from 'electron';

import { eventService } from '../event-bus/event-service';
import { pluginInfoMapper } from '../mapper/plugin-info-mapper';
import { pluginInfoService } from '../plugin/info-service';
import { pluginManager } from '../plugin/manager';
import { validatePluginName } from '../utils/plugin-validator';

export const registerPluginInfoIpcHandlers = (): void => {
  ipcMain.handle('pluginInfo:getInstalledPlugins', async (): Promise<PluginInfo[]> => {
    const entity = await pluginInfoService.getInstalledPlugins();

    // Add app event emit
    eventService.emit(AppEventType.PLUGIN_INFO_GET_INSTALLED, entity);

    return entity.map(pluginInfoMapper.toInterface);
  });

  ipcMain.handle('pluginInfo:getEnabledPlugins', async (): Promise<PluginInfo[]> => {
    const entity = await pluginInfoService.getEnabledPlugins();

    // Add app event emit
    eventService.emit(AppEventType.PLUGIN_INFO_GET_ENABLED, entity);

    return entity.map(pluginInfoMapper.toInterface);
  });

  ipcMain.handle(
    'pluginInfo:getPluginByName',
    async (_, name: string): Promise<PluginInfo | null> => {
      validatePluginName(name);
      const entity = await pluginInfoService.getPluginByName(name);

      // Add app event emit
      eventService.emit(AppEventType.PLUGIN_INFO_GET_BY_NAME, entity);

      return entity ? pluginInfoMapper.toInterface(entity) : null;
    },
  );

  ipcMain.handle(
    'pluginInfo:installPlugin',
    async (_, pluginData: Partial<PluginInfo>): Promise<PluginInfo> => {
      if (!pluginData.id) {
        throw new Error('[PluginInfo] Invalid plugin id (GitHub URL) provided.');
      }

      const entity = await pluginManager.installFromGitHub(pluginData.id);

      // Add app event emit
      eventService.emit(AppEventType.PLUGIN_INFO_INSTALL, entity);

      return pluginInfoMapper.toInterface(entity);
    },
  );

  ipcMain.handle('pluginInfo:installFromLocal', async (): Promise<PluginInfo | null> => {
    const result = await dialog.showOpenDialog({
      title: '로컬 플러그인 설치 (Zip 파일 선택)',
      filters: [{ name: 'Zip Files', extensions: ['zip'] }],
      properties: ['openFile'],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const entity = await pluginManager.installFromLocalZip(result.filePaths[0]);

    // Add app event emit
    eventService.emit(AppEventType.PLUGIN_INFO_INSTALL, entity);

    return pluginInfoMapper.toInterface(entity);
  });

  ipcMain.handle(
    'pluginInfo:togglePlugin',
    async (_, name: string, enable: boolean): Promise<PluginInfo | null> => {
      validatePluginName(name);
      if (typeof enable !== 'boolean') {
        throw new Error('[PluginInfo] Invalid enable value provided.');
      }

      const entity = await pluginInfoService.togglePlugin(name, enable);

      // Add app event emit
      eventService.emit(AppEventType.PLUGIN_INFO_TOGGLE, entity);

      return entity ? pluginInfoMapper.toInterface(entity) : null;
    },
  );

  ipcMain.handle('pluginInfo:uninstallPlugin', async (_, name: string): Promise<boolean> => {
    validatePluginName(name);
    const result = await pluginInfoService.uninstallPlugin(name);

    // Add app event emit
    eventService.emit(AppEventType.PLUGIN_INFO_UNINSTALL, result);
    return result;
  });
};
