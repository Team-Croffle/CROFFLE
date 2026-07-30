import type { Tag as TagInterface } from '@croffledev/croffle-types';

import type { Tag as TagRow } from '../database/schema';

export type TagEntityInput = {
  id?: string;
  name?: string;
  color?: string;
};

export const tagMapper = {
  toInterface(entity: TagRow): TagInterface {
    return {
      id: entity.id,
      name: entity.name,
      color: entity.color,
    };
  },

  toEntity(data: Partial<TagInterface>): TagEntityInput {
    const entity: TagEntityInput = {};

    if (data.id !== undefined) {
      entity.id = data.id;
    }
    if (data.name !== undefined) {
      entity.name = data.name;
    }
    if (data.color !== undefined) {
      entity.color = data.color;
    }

    return entity;
  },
};
