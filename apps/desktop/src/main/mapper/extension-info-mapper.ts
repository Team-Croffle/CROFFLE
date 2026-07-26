import type { ExtensionInfo as ExtensionInfoInterface } from '@croffledev/croffle-types';

import { ExtensionInfo as ExtensionInfoEntity } from '../database/schema/extension-info.entity';

export const extensionInfoMapper = {
  toInterface(entity: ExtensionInfoEntity): ExtensionInfoInterface {
    return {
      ...entity,
      description: entity.description || '',
      features: entity.features || {
        views: [],
        contextMenus: [],
      },
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
    entity.features = api.features;
    return entity;
  },
};
