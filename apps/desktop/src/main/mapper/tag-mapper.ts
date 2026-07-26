import type { Tag as TagInterface } from '@croffledev/croffle-types';

import type { Tag as TagEntity } from '../database/schema/tag.entity';

export const tagMapper = {
  toInterface(entity: TagEntity): TagInterface {
    return {
      ...entity,
    };
  },
  toEntity(data: Partial<TagInterface>): Partial<TagEntity> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entityData: any = { ...data };
    return entityData;
  },
};
