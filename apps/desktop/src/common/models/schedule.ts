import type { Tag } from './tag';

/** App / IPC schedule DTO — dates match drizzle timestamp columns. */
export type Schedule = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  recurrenceRule?: string;
  colorLabel: string;
  priority: 'low' | 'medium' | 'high';
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
};
