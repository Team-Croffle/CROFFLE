export interface Schedule {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  recurrenceRule?: string;
  colorLabel: string;
  tagIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface SearchQuery {
  text?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tagIds?: string[];
}

export interface PluginInfo {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  enabled: boolean;
}

export interface AppSettings {
  notifications: {
    enabled: boolean;
    defaultReminderMinutes: number;
  };
  theme: 'light' | 'dark' | 'system';
}
