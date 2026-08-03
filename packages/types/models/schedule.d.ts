import type { Tag } from './tag';

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
  tags: Tag[];
  priority: 'low' | 'medium' | 'high';
  /** null/undefined = use app-wide notifications.defaultReminderMinutes */
  reminderMinutes?: number | null;
  createdAt: Date;
  updatedAt: Date;
};
