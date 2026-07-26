import { AppEventType } from '@croffledev/common';
import type { ExtensionInfo } from '@croffledev/croffle-types';
import { ipcMain, dialog } from 'electron';

import { eventService } from '../event-bus/event-service';
import { extensionInfoService } from '../extension/info-service';
import { extensionManager } from '../extension/manager';
import { extensionInfoMapper } from '../mapper/extension-info-mapper';
import { validatePluginName } from '../utils/extension-validator';

export const registerExtensionInfoIpcHandlers = (): void => {
  ipcMain.handle('extensionInfo:getInstalledExtensions', async (): Promise<ExtensionInfo[]> => {
    const entity = await extensionInfoService.getInstalledExtensions();

    // Add app event emit
    eventService.emit(AppEventType.EXTENSION_INFO_GET_INSTALLED, entity);

    return entity.map(extensionInfoMapper.toInterface);
  });

  ipcMain.handle('extensionInfo:getEnabledExtensions', async (): Promise<ExtensionInfo[]> => {
    const entity = await extensionInfoService.getEnabledExtensions();

    // Add app event emit
    eventService.emit(AppEventType.EXTENSION_INFO_GET_ENABLED, entity);

    return entity.map(extensionInfoMapper.toInterface);
  });

  ipcMain.handle(
    'extensionInfo:getExtensionByName',
    async (_, name: string): Promise<ExtensionInfo | null> => {
      validatePluginName(name);
      const entity = await extensionInfoService.getExtensionByName(name);

      // Add app event emit
      eventService.emit(AppEventType.EXTENSION_INFO_GET_BY_NAME, entity);

      return entity ? extensionInfoMapper.toInterface(entity) : null;
    },
  );

  ipcMain.handle(
    'extensionInfo:installExtension',
    async (_, pluginData: Partial<ExtensionInfo>): Promise<ExtensionInfo> => {
      if (!pluginData.id) {
        throw new Error('[ExtensionInfo] Invalid plugin id (GitHub URL) provided.');
      }

      const entity = await extensionManager.installFromGitHub(pluginData.id);

      // Add app event emit
      eventService.emit(AppEventType.EXTENSION_INFO_INSTALL, entity);

      return extensionInfoMapper.toInterface(entity);
    },
  );

  ipcMain.handle('extensionInfo:installFromLocal', async (): Promise<ExtensionInfo | null> => {
    const result = await dialog.showOpenDialog({
      title: '로컬 플러그인 설치 (Zip 파일 선택)',
      filters: [{ name: 'Zip Files', extensions: ['zip'] }],
      properties: ['openFile'],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const entity = await extensionManager.installFromLocalZip(result.filePaths[0]);

    // Add app event emit
    eventService.emit(AppEventType.EXTENSION_INFO_INSTALL, entity);

    return extensionInfoMapper.toInterface(entity);
  });

  ipcMain.handle(
    'extensionInfo:toggleExtension',
    async (_, name: string, enable: boolean): Promise<ExtensionInfo | null> => {
      validatePluginName(name);
      if (typeof enable !== 'boolean') {
        throw new Error('[ExtensionInfo] Invalid enable value provided.');
      }

      const entity = await extensionInfoService.toggleExtension(name, enable);

      // Add app event emit
      eventService.emit(AppEventType.EXTENSION_INFO_TOGGLE, entity);

      return entity ? extensionInfoMapper.toInterface(entity) : null;
    },
  );

  ipcMain.handle('extensionInfo:uninstallExtension', async (_, name: string): Promise<boolean> => {
    validatePluginName(name);
    const result = await extensionInfoService.uninstallExtension(name);

    // Add app event emit
    eventService.emit(AppEventType.EXTENSION_INFO_UNINSTALL, result);
    return result;
  });
};
