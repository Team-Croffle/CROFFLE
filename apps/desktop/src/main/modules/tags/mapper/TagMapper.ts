import type { Tag as TagEntity } from '../model/Tag';
import type { Tag as TagInterface } from '@croffledev/croffle-types';

export const TagMapper = {
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
