import { asc, eq } from 'drizzle-orm';

import { databaseManager } from '../database';
import { extensionInfo, type ExtensionInfo, type NewExtensionInfo } from '../database/schema';

export const extensionInfoService = {
  getInstalledExtensions: async (): Promise<ExtensionInfo[]> => {
    const db = databaseManager.getDb();
    return db.select().from(extensionInfo).orderBy(asc(extensionInfo.name));
  },

  getEnabledExtensions: async (): Promise<ExtensionInfo[]> => {
    const db = databaseManager.getDb();
    return db
      .select()
      .from(extensionInfo)
      .where(eq(extensionInfo.enabled, true))
      .orderBy(asc(extensionInfo.name));
  },

  getExtensionByName: async (name: string): Promise<ExtensionInfo | null> => {
    const db = databaseManager.getDb();
    const row = await db.query.extensionInfo.findFirst({
      where: eq(extensionInfo.name, name),
    });
    return row ?? null;
  },

  installExtension: async (data: Partial<ExtensionInfo>): Promise<ExtensionInfo> => {
    const db = databaseManager.getDb();

    const existingById = data.id
      ? await db.query.extensionInfo.findFirst({
          where: eq(extensionInfo.id, data.id),
        })
      : null;

    if (existingById) {
      const updated: ExtensionInfo = {
        id: existingById.id,
        name: data.name ?? existingById.name,
        version: data.version ?? existingById.version,
        author: data.author ?? existingById.author,
        description: data.description !== undefined ? data.description : existingById.description,
        enabled: data.enabled ?? existingById.enabled,
        main: data.main !== undefined ? data.main : existingById.main,
        engines: data.engines !== undefined ? data.engines : existingById.engines,
        contributes: data.contributes !== undefined ? data.contributes : existingById.contributes,
      };
      await db
        .update(extensionInfo)
        .set({
          name: updated.name,
          version: updated.version,
          author: updated.author,
          description: updated.description,
          enabled: updated.enabled,
          main: updated.main,
          engines: updated.engines,
          contributes: updated.contributes,
        })
        .where(eq(extensionInfo.id, existingById.id));
      return updated;
    }

    if (data.name) {
      const existingByName = await db.query.extensionInfo.findFirst({
        where: eq(extensionInfo.name, data.name),
      });
      if (existingByName) {
        throw new Error(`Extension with name "${data.name}" is already installed.`);
      }
    }

    if (!data.id || !data.name || !data.version || !data.author) {
      throw new Error('Extension id, name, version, and author are required.');
    }

    const row: NewExtensionInfo = {
      id: data.id,
      name: data.name,
      version: data.version,
      author: data.author,
      description: data.description ?? null,
      enabled: data.enabled ?? true,
      main: data.main ?? null,
      engines: data.engines ?? null,
      contributes: data.contributes ?? null,
    };

    await db.insert(extensionInfo).values(row);
    return {
      id: row.id,
      name: row.name,
      version: row.version,
      author: row.author,
      description: row.description ?? null,
      enabled: row.enabled ?? true,
      main: row.main ?? null,
      engines: row.engines ?? null,
      contributes: row.contributes ?? null,
    };
  },

  toggleExtension: async (id: string, enable: boolean): Promise<ExtensionInfo | null> => {
    const db = databaseManager.getDb();
    const row = await db.query.extensionInfo.findFirst({
      where: eq(extensionInfo.id, id),
    });
    if (!row) {
      throw new Error(`Extension "${id}" not found.`);
    }

    await db.update(extensionInfo).set({ enabled: enable }).where(eq(extensionInfo.id, id));
    return { ...row, enabled: enable };
  },

  uninstallExtension: async (id: string): Promise<boolean> => {
    const db = databaseManager.getDb();
    const result = await db.delete(extensionInfo).where(eq(extensionInfo.id, id)).returning();
    return result.length > 0;
  },
};
