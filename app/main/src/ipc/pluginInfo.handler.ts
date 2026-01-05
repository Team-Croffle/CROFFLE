import { ipcMain } from 'electron';
import { pluginService } from '../core/plugin-info/service/PluginInfoService';
import { PluginInfo } from '../core/plugin-info/model/PluginInfo';
import { validatePluginInstallation } from '../core/helper/pluginValidator';

export const registerPluginInfoIpcHandlers = (): void => {
  ipcMain.handle('pluginInfo:getInstalledPlugins', async (): Promise<PluginInfo[]> => {
    return pluginService.getInstalledPlugins();
  });

  ipcMain.handle('pluginInfo:getEnabledPlugins', async (): Promise<PluginInfo[]> => {
    return pluginService.getEnabledPlugins();
  });

  ipcMain.handle(
    'pluginInfo:getPluginByName',
    async (_, name: string): Promise<PluginInfo | null> => {
      return pluginService.getPluginByName(name);
    }
  );

  ipcMain.handle(
    'pluginInfo:installPlugin',
    async (_, pluginData: Partial<PluginInfo>): Promise<PluginInfo> => {
      validatePluginInstallation(pluginData);

      const existing = await pluginService.getPluginByName(pluginData.name!);
      if (existing) {
        throw new Error(`Plugin with name "${pluginData.name}" is already installed.`);
      }

      return pluginService.installPlugin(pluginData);
    }
  );

  ipcMain.handle(
    'pluginInfo:togglePlugin',
    async (_, name: string, enable: boolean): Promise<PluginInfo | null> => {
      return pluginService.togglePlugin(name, enable);
    }
  );

  ipcMain.handle('pluginInfo:uninstallPlugin', async (_, name: string): Promise<boolean> => {
    return pluginService.uninstallPlugin(name);
  });
};

export interface PluginInfoAPI {
  getInstalledPlugins: () => Promise<PluginInfo[]>;
  getEnabledPlugins: () => Promise<PluginInfo[]>;
  getPluginByName: (name: string) => Promise<PluginInfo | null>;
  installPlugin: (pluginData: Partial<PluginInfo>) => Promise<PluginInfo>;
  togglePlugin: (name: string, enable: boolean) => Promise<PluginInfo | null>;
  uninstallPlugin: (name: string) => Promise<boolean>;
}
