import type { Schedule, Tag } from '@croffledev/common';

import type { ScheduleWithTags, TagRow } from '../database/schema';

/** Drizzle write input (dates already as Date). */
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
  tags?: TagRow[];
};

function toTag(tag: Tag): TagRow {
  return {
    id: tag.id,
    name: tag.name,
    color: tag.color,
  };
}

function toTagDto(tag: TagRow): Tag {
  return {
    id: tag.id,
    name: tag.name,
    color: tag.color,
  };
}

function toDate(value: Date): Date {
  return value instanceof Date ? value : new Date(value);
}

export const scheduleMapper = {
  toInterface(entity: ScheduleWithTags): Schedule {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description ?? '',
      location: entity.location ?? '',
      startDate: entity.startDate,
      endDate: entity.endDate,
      isAllDay: entity.isAllDay,
      recurrenceRule: entity.recurrenceRule ?? undefined,
      colorLabel: entity.colorLabel,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      tags: entity.tags.map(toTagDto),
    };
  },

  toEntity(data: Partial<Schedule>): ScheduleEntityInput {
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
      entity.startDate = toDate(data.startDate);
    }
    if (data.endDate !== undefined) {
      entity.endDate = toDate(data.endDate);
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
      entity.createdAt = toDate(data.createdAt);
    }
    if (data.updatedAt !== undefined) {
      entity.updatedAt = toDate(data.updatedAt);
    }
    if (data.tags !== undefined) {
      entity.tags = data.tags.map(toTag);
    }

    return entity;
  },
};
