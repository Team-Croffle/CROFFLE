export interface Schedule {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
  isAllDay: boolean;
  recurrenceRule?: string;
  colorLabel: string;
  tags: Tag[];
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface SearchQuery {
  text?: string;
  dateRange?: {
    start: string; // ISO 8601 format
    end: string; // ISO 8601 format
  };
  tags?: Tag[];
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
  general: {
    language: 'ko' | 'en';
    theme: 'light' | 'dark' | 'system';
    autoUpdate: boolean;
    startupBehavior: 'openLastSession' | 'openNewWindow' | 'doNothing';
    startOnSystemBoot: boolean;
    startMinimized: boolean;
  };
  calendar: {
    defaultView: 'day' | 'week' | 'month' | 'year';
    weekStartDay: 'sunday' | 'monday';
    showWeekNumbers: boolean;
    timeFormat: '12h' | '24h';
  };
  notifications: {
    enabled: boolean;
    defaultReminderMinutes: number;
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  general: {
    language: 'en',
    theme: 'system',
    autoUpdate: true,
    startupBehavior: 'openLastSession',
    startOnSystemBoot: false,
    startMinimized: false,
  },
  calendar: {
    defaultView: 'month',
    weekStartDay: 'sunday',
    showWeekNumbers: false,
    timeFormat: '24h',
  },
  notifications: {
    enabled: true,
    defaultReminderMinutes: 10,
  },
};
