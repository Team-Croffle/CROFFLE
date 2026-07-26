import type { CalendarApi } from './api/calendar';
import type { EventApi } from './api/event';
import type { HttpApi } from './api/http';
import type { OsApi } from './api/os';
import type { PluginsApi } from './api/plugins';
import type { SettingsApi } from './api/settings';
import type { UiApi } from './api/ui';
import type { WindowApi } from './api/window';
import type { AppEventType } from './enums';
import type {
  AppSettingLanguage,
  AppSettingStartupBehavior,
  AppSettingTheme,
  CalendarTimeFormat,
  CalendarView,
  CalendarWeekStartDay,
} from './models/app-settings';
import type { ClipboardDataType } from './models/clipboard';

export interface EnumsApi {
  AppSettingLanguage: typeof AppSettingLanguage;
  AppSettingTheme: typeof AppSettingTheme;
  AppSettingStartupBehavior: typeof AppSettingStartupBehavior;
  CalendarView: typeof CalendarView;
  CalendarWeekStartDay: typeof CalendarWeekStartDay;
  CalendarTimeFormat: typeof CalendarTimeFormat;
  ClipboardDataType: typeof ClipboardDataType;
  AppEventType: typeof AppEventType;
}

/** Preload에 노출되는 호스트 API (ui 제외) */
export interface CroffleAPI {
  window: WindowApi;
  os: OsApi;
  http: HttpApi;
  event: EventApi;
  calendar: CalendarApi;
  settings: SettingsApi;
  plugins: PluginsApi;
  enums: EnumsApi;
}

/** 플러그인 activated(context)에 전달되는 API (+ ui) */
export type PluginContext = CroffleAPI & {
  ui: UiApi;
};
