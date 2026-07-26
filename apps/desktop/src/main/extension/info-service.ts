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

  installExtension: async (data: Partial<ExtensionInfo>): Promise<ExtensionInfo> => {
    const repo = databaseManager.getRepository(ExtensionInfo);

    const existingById = await repo.findOne({ where: { id: data.id! } });
    if (existingById) {
      Object.assign(existingById, data);
      return repo.save(existingById);
    }

    const existingByName = await repo.findOne({ where: { name: data.name! } });
    if (existingByName) {
      throw new Error(`Extension with name "${data.name}" is already installed.`);
    }

    return repo.save(repo.create(data));
  },

  toggleExtension: async (id: string, enable: boolean): Promise<ExtensionInfo | null> => {
    const repo = databaseManager.getRepository(ExtensionInfo);
    const row = await repo.findOne({ where: { id } });
    if (!row) {
      throw new Error(`Extension "${id}" not found.`);
    }
    row.enabled = enable;
    return repo.save(row);
  },

  uninstallExtension: async (id: string): Promise<boolean> => {
    const repo = databaseManager.getRepository(ExtensionInfo);
    const result = await repo.delete({ id });
    return result.affected !== undefined && result.affected !== null && result.affected > 0;
  },
};
