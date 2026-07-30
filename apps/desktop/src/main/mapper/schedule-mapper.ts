import type { Schedule as ScheduleInterface, Tag as TagInterface } from '@croffledev/croffle-types';

import type { ScheduleWithTags, Tag } from '../database/schema';

/** Drizzle timestamp 컬럼은 Date로 주고받는다 */
export type ScheduleEntityInput = {
  id?: string;
  title?: string;
  description?: string | null;
  location?: string | null;
  startDate?: Date;
  endDate?: Date;
  isAllDay?: boolean;
  recurrenceRule?: string | null;
  colorLabel?: string;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: Tag[];
};

function toTag(tag: TagInterface): Tag {
  return {
    id: tag.id,
    name: tag.name,
    color: tag.color,
  };
}

function toTagInterface(tag: Tag): TagInterface {
  return {
    id: tag.id,
    name: tag.name,
    color: tag.color,
  };
}

export const scheduleMapper = {
  toInterface(entity: ScheduleWithTags): ScheduleInterface {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description ?? '',
      location: entity.location ?? '',
      startDate: entity.startDate.toISOString(),
      endDate: entity.endDate.toISOString(),
      isAllDay: entity.isAllDay,
      recurrenceRule: entity.recurrenceRule ?? undefined,
      colorLabel: entity.colorLabel,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      tags: entity.tags.map(toTagInterface),
    };
  },

  toEntity(data: Partial<ScheduleInterface>): ScheduleEntityInput {
    const entity: ScheduleEntityInput = {};

    if (data.id !== undefined) {
      entity.id = data.id;
    }
    if (data.title !== undefined) {
      entity.title = data.title;
    }
    if (data.description !== undefined) {
      entity.description = data.description;
    }
    if (data.location !== undefined) {
      entity.location = data.location;
    }
    if (data.startDate !== undefined) {
      entity.startDate = new Date(data.startDate);
    }
    if (data.endDate !== undefined) {
      entity.endDate = new Date(data.endDate);
    }
    if (data.isAllDay !== undefined) {
      entity.isAllDay = data.isAllDay;
    }
    if (data.recurrenceRule !== undefined) {
      entity.recurrenceRule = data.recurrenceRule;
    }
    if (data.colorLabel !== undefined) {
      entity.colorLabel = data.colorLabel;
    }
    if (data.createdAt !== undefined) {
      entity.createdAt = new Date(data.createdAt);
    }
    if (data.updatedAt !== undefined) {
      entity.updatedAt = new Date(data.updatedAt);
    }
    if (data.tags !== undefined) {
      entity.tags = data.tags.map(toTag);
    }

    return entity;
  },
};
