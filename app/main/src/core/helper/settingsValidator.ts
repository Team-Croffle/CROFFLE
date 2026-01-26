import {
  AppSettings,
  AppSettingStartupBehavior,
  AppSettingTheme,
  CalendarTimeFormat,
  CalendarView,
  CalendarWeekStartDay,
} from 'croffle';
import { AppSettingLanguage } from 'croffle';

function isValidEnum<T extends object>(value: unknown, enumObj: T): value is T[keyof T] {
  const validValues = Object.values(enumObj);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return validValues.includes(value as any);
}

export const validateSettings = (settings: Partial<AppSettings>): void => {
  if (settings.general) {
    const { language, theme, startupBehavior } = settings.general;

    if (language && !isValidEnum(language, AppSettingLanguage)) {
      throw new Error(
        `Invalid language setting: ${language}. Allowed values are: ${Object.values(AppSettingLanguage).join(', ')}`
      );
    }

    if (theme && !isValidEnum(theme, AppSettingTheme)) {
      throw new Error(
        `Invalid theme setting: ${theme}. Allowed values are: ${Object.values(AppSettingTheme).join(', ')}`
      );
    }

    if (startupBehavior && !isValidEnum(startupBehavior, AppSettingStartupBehavior)) {
      throw new Error(
        `Invalid startupBehavior setting: ${startupBehavior}. Allowed values are: ${Object.values(AppSettingStartupBehavior).join(', ')}`
      );
    }
  }

  if (settings.calendar) {
    const { defaultView, weekStartDay, timeFormat } = settings.calendar || {};
    if (defaultView && !isValidEnum(defaultView, CalendarView)) {
      throw new Error(
        `Invalid defaultView setting: ${defaultView}. Allowed values are: ${Object.values(CalendarView).join(', ')}`
      );
    }

    if (weekStartDay && !isValidEnum(weekStartDay, CalendarWeekStartDay)) {
      throw new Error(
        `Invalid weekStartDay setting: ${weekStartDay}. Allowed values are: ${Object.values(CalendarWeekStartDay).join(', ')}`
      );
    }

    if (timeFormat && !isValidEnum(timeFormat, CalendarTimeFormat)) {
      throw new Error(
        `Invalid timeFormat setting: ${timeFormat}. Allowed values are: ${Object.values(CalendarTimeFormat).join(', ')}`
      );
    }
  }
};
