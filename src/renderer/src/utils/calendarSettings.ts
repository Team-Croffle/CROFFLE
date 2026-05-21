import { type AppSettings } from '@croffledev/croffle-types';
import {
  CalendarTimeFormat,
  CalendarView,
  CalendarWeekStartDay,
} from '../../../shared/enums';

export const calendarViewToFullCalendar = (view: CalendarView): string => {
  const map: Record<CalendarView, string> = {
    [CalendarView.DAY]: 'timeGridDay',
    [CalendarView.WEEK]: 'timeGridWeek',
    [CalendarView.MONTH]: 'dayGridMonth',
    [CalendarView.YEAR]: 'multiMonthYear',
  };
  return map[view] ?? 'dayGridMonth';
};

export const weekStartDayToFirstDay = (day: CalendarWeekStartDay): number => {
  return day === CalendarWeekStartDay.MONDAY ? 1 : 0;
};

export const timeFormatToHour12 = (format: CalendarTimeFormat): boolean => {
  return format === CalendarTimeFormat.H12;
};

export const languageToLocale = (language: AppSettings['general']['language']): string => {
  return language === 'ko' ? 'ko' : 'en';
};
