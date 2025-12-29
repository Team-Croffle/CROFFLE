import { ipcMain } from 'electron';
import { pluginService } from '../core/plugin-info/service/PluginInfoService';
import { PluginInfo } from '../core/plugin-info/model/PluginInfo';

export const registerPluginInfoIpcHandlers = (): void => {
  // Placeholder for future IPC handlers related to plugin information
  ipcMain.handle('pluginInfo:getInstalledPlugins', async (): Promise<PluginInfo[]> => {
    // Future implementation will go here
    return pluginService.getInstalledPlugins();
  });

  ipcMain.handle('pluginInfo:getEnabledPlugins', async (): Promise<PluginInfo[]> => {
    // Future implementation will go here
    return pluginService.getEnabledPlugins();
  });

  ipcMain.handle(
    'pluginInfo:getPluginByName',
    async (_, name: string): Promise<PluginInfo | null> => {
      // Future implementation will go here
      return pluginService.getPluginByName(name);
    }
  );

  ipcMain.handle(
    'pluginInfo:installPlugin',
    async (_, pluginData: Partial<PluginInfo>): Promise<PluginInfo> => {
      // Future implementation will go here
      return pluginService.installPlugin(pluginData);
    }
  );

  ipcMain.handle(
    'pluginInfo:togglePlugin',
    async (_, name: string, enable: boolean): Promise<PluginInfo | null> => {
      // Future implementation will go here
      return pluginService.togglePlugin(name, enable);
    }
  );

  ipcMain.handle('pluginInfo:uninstallPlugin', async (_, name: string): Promise<boolean> => {
    // Future implementation will go here
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
