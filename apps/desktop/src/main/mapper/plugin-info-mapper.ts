import type { PluginInfo as PluginInfoInterface } from '@croffledev/croffle-types';

import { PluginInfo as PluginInfoEntity } from '../database/schema/plugin-info.entity';

export const pluginInfoMapper = {
  toInterface(entity: PluginInfoEntity): PluginInfoInterface {
    return {
      ...entity,
      description: entity.description || '',
      features: entity.features || {
        views: [],
        contextMenus: [],
      },
    };
  },

  toEntity(api: PluginInfoInterface): PluginInfoEntity {
    const entity = new PluginInfoEntity();
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
