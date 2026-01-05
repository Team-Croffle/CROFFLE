export enum AppSettingLanguage {
  KO = 'ko',
  EN = 'en',
}

export enum AppSettingTheme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum AppSettingStartupBehavior {
  OPEN_LAST_SESSION = 'openLastSession',
  OPEN_NEW_WINDOW = 'openNewWindow',
  DO_NOTHING = 'doNothing',
}

export enum CalendarView {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export enum CalendarWeekStartDay {
  SUNDAY = 'sunday',
  MONDAY = 'monday',
}

export enum CalendarTimeFormat {
  H12 = '12h',
  H24 = '24h',
}

export interface AppSettings {
  general: {
    language: AppSettingLanguage;
    theme: AppSettingTheme;
    autoUpdate: boolean;
    startupBehavior: AppSettingStartupBehavior;
    startOnSystemBoot: boolean;
    startMinimized: boolean;
  };
  calendar: {
    defaultView: CalendarView;
    weekStartDay: CalendarWeekStartDay;
    showWeekNumbers: boolean;
    timeFormat: CalendarTimeFormat;
  };
  notifications: {
    enabled: boolean;
    defaultReminderMinutes: number;
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  general: {
    language: AppSettingLanguage.EN,
    theme: AppSettingTheme.SYSTEM,
    autoUpdate: true,
    startupBehavior: AppSettingStartupBehavior.OPEN_LAST_SESSION,
    startOnSystemBoot: false,
    startMinimized: false,
  },
  calendar: {
    defaultView: CalendarView.MONTH,
    weekStartDay: CalendarWeekStartDay.SUNDAY,
    showWeekNumbers: false,
    timeFormat: CalendarTimeFormat.H24,
  },
  notifications: {
    enabled: true,
    defaultReminderMinutes: 10,
  },
};
