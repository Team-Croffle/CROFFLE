export declare enum AppSettingLanguage {
  KO = 'ko',
  EN = 'en',
}

export declare enum AppSettingTheme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export declare enum AppSettingStartupBehavior {
  OPEN_LAST_SESSION = 'openLastSession',
  OPEN_NEW_WINDOW = 'openNewWindow',
  DO_NOTHING = 'doNothing',
}

export declare enum CalendarView {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export declare enum CalendarWeekStartDay {
  SUNDAY = 'sunday',
  MONDAY = 'monday',
}

export declare enum CalendarTimeFormat {
  H12 = '12h',
  H24 = '24h',
}

export type AppSettings = {
  general: {
    language: AppSettingLanguage;
    theme: AppSettingTheme;
    autoUpdate: boolean;
    startupBehavior: AppSettingStartupBehavior;
    startOnSystemBoot: boolean;
    startMinimized: boolean;
  };
  appearance: {
    /** Accent color hue in degrees (0–360). Drives --croffle-accent-hue. */
    accentHue: number;
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
};
