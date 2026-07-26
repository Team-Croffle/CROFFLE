import { databaseManager } from '../database';
import { ExtensionInfo } from '../database/schema/extension-info.entity';

export const extensionInfoService = {
  getInstalledExtensions: async (): Promise<ExtensionInfo[]> => {
    const repo = databaseManager.getRepository(ExtensionInfo);
    return repo.find({
      order: {
        name: 'ASC',
      },
    });
  },

  getEnabledExtensions: async (): Promise<ExtensionInfo[]> => {
    const repo = databaseManager.getRepository(ExtensionInfo);
    return repo.find({
      where: {
        enabled: true,
      },
      order: {
        name: 'ASC',
      },
    });
  },

  getExtensionByName: async (name: string): Promise<ExtensionInfo | null> => {
    const repo = databaseManager.getRepository(ExtensionInfo);
    return repo.findOne({
      where: {
        name,
      },
    });
  },

  installExtension: async (pluginData: Partial<ExtensionInfo>): Promise<ExtensionInfo> => {
    const repo = databaseManager.getRepository(ExtensionInfo);

    const existing = await repo.findOne({ where: { name: pluginData.name! } });
    if (existing) {
      throw new Error(`Plugin with name "${pluginData.name}" is already installed.`);
    }

    const plugin = repo.create(pluginData);
    return repo.save(plugin);
  },

  toggleExtension: async (id: string, enable: boolean): Promise<ExtensionInfo | null> => {
    const repo = databaseManager.getRepository(ExtensionInfo);
    const plugin = await repo.findOne({ where: { id } });
    if (!plugin) {
      throw new Error(`Plugin "${id}" not found.`);
    }
    plugin.enabled = enable;
    return repo.save(plugin);
  },

  uninstallExtension: async (id: string): Promise<boolean> => {
    const repo = databaseManager.getRepository(ExtensionInfo);
    const result = await repo.delete({ id });
    return result.affected !== undefined && result.affected !== null && result.affected > 0;
  },
};
