import type { ExtensionInfo as ExtensionInfoInterface } from '@croffledev/croffle-types';

import type { ExtensionInfo as ExtensionInfoRow, NewExtensionInfo } from '../database/schema';

export const extensionInfoMapper = {
  toInterface(entity: ExtensionInfoRow): ExtensionInfoInterface {
    return {
      id: entity.id,
      name: entity.name,
      version: entity.version,
      author: entity.author,
      description: entity.description ?? '',
      main: entity.main ?? undefined,
      engines: entity.engines ?? undefined,
      contributes: entity.contributes ?? {},
      enabled: entity.enabled,
    };
  },

  toEntity(api: ExtensionInfoInterface): NewExtensionInfo {
    return {
      id: api.id,
      name: api.name,
      version: api.version,
      author: api.author,
      description: api.description ?? null,
      enabled: api.enabled,
      main: api.main ?? null,
      engines: api.engines ?? null,
      contributes: api.contributes ?? {},
    };
  },
};
