import type { Tag } from './tag';

export type Schedule = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  isAllDay: boolean;
  recurrenceRule?: string;
  colorLabel: string;
  tags: Tag[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};
