import type { Tag } from '@croffledev/common';

import type { TagRow } from '../database/schema';

export type TagEntityInput = {
  id?: string;
  name?: string;
  color?: string;
};

export const tagMapper = {
  toInterface(entity: TagRow): Tag {
    return {
      id: entity.id,
      name: entity.name,
      color: entity.color,
    };
  },

  toEntity(data: Partial<Tag>): TagEntityInput {
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
