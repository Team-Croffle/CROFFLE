import type { ExtensionInfo as ExtensionInfoInterface } from '@croffledev/croffle-types';

import { ExtensionInfo as ExtensionInfoEntity } from '../database/schema/extension-info.entity';

export const extensionInfoMapper = {
  toInterface(entity: ExtensionInfoEntity): ExtensionInfoInterface {
    return {
      id: entity.id,
      name: entity.name,
      version: entity.version,
      author: entity.author,
      description: entity.description || '',
      main: entity.main,
      engines: (entity.engines as ExtensionInfoInterface['engines']) || undefined,
      contributes: (entity.contributes as ExtensionInfoInterface['contributes']) || {},
      enabled: entity.enabled,
    };
  },

  toEntity(api: ExtensionInfoInterface): ExtensionInfoEntity {
    const entity = new ExtensionInfoEntity();
    entity.id = api.id;
    entity.name = api.name;
    entity.version = api.version;
    entity.author = api.author;
    entity.description = api.description || undefined;
    entity.enabled = api.enabled;
    entity.main = api.main;
    entity.engines = api.engines;
    entity.contributes = api.contributes ?? {};
    return entity;
  },
};
