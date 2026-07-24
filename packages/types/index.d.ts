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

export interface FeatureView {
  id: string;
  title: string;
  subtitle: string;
  icon: unknown;
  url: string;
  active?: boolean;
  pluginName?: string;
  pluginId?: string;
}

export interface FeatureContextMenu {
  id: string;
  label: string;
  action: (targetElement: HTMLElement | null) => void;
  condition?: (targetElement: HTMLElement | null) => boolean;
  disabled?: boolean;
  targetView?: string[];
  pluginId?: string;
}

/** 설정 항목 스키마 (extension SDK / manifest 공용) */
export type ConfigItemType =
  | "string"
  | "number"
  | "boolean"
  | "select"
  | "path";

export interface ConfigItemSchema<T = unknown> {
  type: ConfigItemType;
  label: string;
  description?: string;
  defaultValue: T;
  options?: Array<{
    label: string;
    value: T extends string | number ? T : never;
  }>;
}

/** extension이 기여하는 설정 섹션 (선언형) */
export interface SettingsSectionContribution {
  id: string;
  title?: string;
  description?: string;
  items: Record<string, ConfigItemSchema>;
}

/** extension이 기여하는 설정 탭 */
export interface SettingsTabContribution {
  id: string;
  label: string;
  icon?: unknown;
  pluginId: string;
  pluginName?: string;
  order?: number;
  /** 커스텀 패널 렌더러 (Vue 외부 DOM 마운트) */
  render?: (container: HTMLElement) => void;
  /** 선언형 스키마 섹션 (render와 동시 사용 불가) */
  sections?: SettingsSectionContribution[];
}

/** manifest(plugin.json)에 선언 가능한 설정 탭 메타 (render 제외) */
export type SettingsTabManifest = Omit<
  SettingsTabContribution,
  "pluginId" | "pluginName" | "render"
>;

export interface PluginInfo {
  enabled: boolean;
  id: string;
  name: string;
  version: string;
  author: string;
  main?: string;
  description?: string;
  features: {
    views?: FeatureView[];
    contextMenus?: FeatureContextMenu[];
    settingsTabs?: SettingsTabManifest[];
  };
}

export enum AppSettingLanguage {
  KO = "ko",
  EN = "en",
}

export enum AppSettingTheme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export enum AppSettingStartupBehavior {
  OPEN_LAST_SESSION = "openLastSession",
  OPEN_NEW_WINDOW = "openNewWindow",
  DO_NOTHING = "doNothing",
}

export enum CalendarView {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export enum CalendarWeekStartDay {
  SUNDAY = "sunday",
  MONDAY = "monday",
}

export enum CalendarTimeFormat {
  H12 = "12h",
  H24 = "24h",
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

export enum ClipboardDataType {
  TEXT = "text",
  IMAGE = "image",
  EMPTY = "empty",
  ERROR = "error",
}

export interface ClipboardResult {
  type: ClipboardDataType;
  value: string | Buffer | null;
}

export interface ClipboardTextData {
  type: ClipboardDataType.TEXT;
  value: string;
}

export interface ClipboardImageData {
  type: ClipboardDataType.IMAGE;
  value: Buffer;
}

export interface HttpResponse<T = unknown> {
  ok: boolean;
  status: number;
  data: T | null;
}

export enum AppEventType {
  SCHEDULE_GET = "schedule:get",
  SCHEDULE_CREATE = "schedule:create",
  SCHEDULE_UPDATE = "schedule:update",
  SCHEDULE_DELETE = "schedule:delete",
  SCHEDULE_EXPORT_TO_FILE = "schedule:exportToFile",
  SCHEDULE_IMPORT_FROM_FILE = "schedule:importFromFile",

  TAG_GET = "tag:getAll",
  TAG_GET_BY_NAME = "tag:getByName",
  TAG_CREATE = "tag:create",
  TAG_UPDATE = "tag:update",
  TAG_DELETE = "tag:delete",

  PLUGIN_INFO_GET_INSTALLED = "pluginInfo:getInstalled",
  PLUGIN_INFO_GET_ENABLED = "pluginInfo:getEnabled",
  PLUGIN_INFO_GET_BY_NAME = "pluginInfo:getByName",
  PLUGIN_INFO_CREATE = "pluginInfo:create",
  PLUGIN_INFO_UPDATE = "pluginInfo:update",
  PLUGIN_INFO_DELETE = "pluginInfo:delete",

  PLUGIN_STORAGE_GET = "pluginStorage:get",
  PLUGIN_STORAGE_SET = "pluginStorage:set",
  PLUGIN_STORAGE_DELETE = "pluginStorage:delete",

  SETTINGS_GET = "settings:get",
  SETTINGS_GET_OF = "settings:getOf",
  SETTINGS_UPDATE = "settings:update",

  WINDOW_MINIMIZE = "window:minimize",
  WINDOW_RESTORE = "window:restore",
  WINDOW_MAXIMIZE = "window:maximize",
  WINDOW_CLOSE = "window:close",
  WINDOW_EXIT = "window:exit",
  WINDOW_CHECK_FOR_UPDATES = "window:checkForUpdates",
  WINDOW_SHOW = "window:show",
  WINDOW_HIDE = "window:hide",

  NATIVE_OS_NOTIFICATION = "nativeOs:notification",
  NATIVE_OS_CLIPBOARD_GET = "nativeOs:clipboard:get",
  NATIVE_OS_CLIPBOARD_SET = "nativeOs:clipboard:set",

  HTTP_SERVICE_GET = "httpService:get",
  HTTP_SERVICE_POST = "httpService:post",

  PLUGIN_INSTALL = "plugin:install",
  PLUGIN_TOGGLE = "plugin:toggle",
  PLUGIN_UNINSTALL = "plugin:uninstall",

  PLUGIN_SESSION_STORAGE_GET = "sessionStorage:get",
  PLUGIN_SESSION_STORAGE_SET = "sessionStorage:set",
  PLUGIN_SESSION_STORAGE_CLEAR = "sessionStorage:clear",
  PLUGIN_SESSION_STORAGE_DELETE = "sessionStorage:delete",
  PLUGIN_SESSION_STORAGE_CLEAR_ALL = "sessionStorage:clearAll",

  SCHEDULER_REGISTER = "scheduler:register",
  SCHEDULER_UNREGISTER = "scheduler:unregister",

  UI_ADD_MENU_ITEM = "ui:addMenuItem",
  UI_CONTEXT_MENU_ADD_ITEM = "ui:contextMenu:addItem",
}

/** ui.registerSettingsTab 옵션 */
export interface RegisterSettingsTabOptions {
  label: string;
  icon?: unknown;
  order?: number;
  render?: (container: HTMLElement) => void;
  sections?: SettingsSectionContribution[];
}

export interface PluginContext {
  base: typeof base;
  app: typeof app;
  enums: typeof enums;
  ui: typeof ui;
}

export namespace windows {
  export function minimize(): Promise<void>;
  export function maximize(): Promise<void>;
  export function close(): Promise<void>;
  export function exitApp(): Promise<void>;
  export function checkForUpdates(): Promise<void>;
  export function setCloseToTrayMode(enabled: boolean): Promise<void>;
}

export namespace tags {
  export function getAll(): Promise<Tag[]>;
  export function getByName(name: string): Promise<Tag | null>;
  export function create(name: string, color: string): Promise<Tag>;
  export function modify(id: string, name: string, color: string): Promise<Tag>;
  export function remove(id: string): Promise<boolean>;
}

export namespace schedules {
  export function getAll(period: {
    start: string;
    end: string;
  }): Promise<Schedule[]>;
  export function create(data: Partial<Schedule>): Promise<Schedule>;
  export function update(
    id: string,
    data: Partial<Schedule>,
  ): Promise<Schedule>;
  export function remove(id: string): Promise<boolean>;
  export function exportSchedulesToFile(period?: {
    start: string;
    end: string;
  }): Promise<{ filePath: string; count: number } | null>;
  export function importScheduleFromFile(
    mode?: "merge" | "duplicate",
  ): Promise<{ created: number; updated: number } | null>;
}

export namespace pluginInfo {
  export function getInstalled(): Promise<PluginInfo[]>;
  export function getEnabled(): Promise<PluginInfo[]>;
  export function getByName(name: string): Promise<PluginInfo | null>;
  export function install(data: Partial<PluginInfo>): Promise<PluginInfo>;
  export function installFromLocal(): Promise<PluginInfo | null>;
  export function toggle(
    name: string,
    enable: boolean,
  ): Promise<PluginInfo | null>;
  export function uninstall(name: string): Promise<boolean>;
}

export namespace search {
  export function search(query: SearchQuery): Promise<Schedule[]>;
}

/** 앱 전역 설정 (settings.json) */
export namespace settings {
  export function getAll(): Promise<AppSettings>;
  export function getOf(key: string): Promise<AppSettings[keyof AppSettings]>;
  export function update(
    newSettings: Partial<AppSettings>,
  ): Promise<AppSettings>;
}

/** 플러그인별 설정 저장소 (pluginStorage 기반) */
export namespace pluginSettings {
  export function get<T = Record<string, unknown>>(
    pluginId: string,
    storageKey?: string,
  ): Promise<T>;
  export function set(
    pluginId: string,
    values: Record<string, unknown>,
    storageKey?: string,
  ): Promise<void>;
}

export namespace pluginStorage {
  export function get(pluginId: string, key: string): Promise<string | null>;
  export function set(
    pluginId: string,
    key: string,
    value: string,
  ): Promise<void>;
}

export namespace os {
  export function showNotification(title: string, body: string): Promise<void>;
  export function getClipboard(): Promise<ClipboardResult>;
  export function setClipboard(
    data: ClipboardTextData | ClipboardImageData,
  ): Promise<void>;
}

export namespace http {
  export function get(
    url: string,
    params?: Record<string, string>,
    headers?: Record<string, string>,
  ): Promise<HttpResponse>;
  export function post(
    url: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<HttpResponse>;
}

export namespace event {
  export function emit(type: string, payload: unknown): void;
  export function on(
    type: string,
    callback: (payload: unknown) => void,
  ): () => void;
}

export const base: {
  windows: typeof windows;
  tags: typeof tags;
  schedules: typeof schedules;
  pluginInfo: typeof pluginInfo;
  search: typeof search;
  settings: typeof settings;
  pluginSettings: typeof pluginSettings;
};

export interface PluginSessionAPI {
  get: <T = unknown>(pluginId: string, key: string) => Promise<T | null>;
  set: <T = unknown>(pluginId: string, key: string, value: T) => Promise<void>;
  delete: (pluginId: string, key: string) => Promise<boolean>;
  clear: (pluginId: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export const app: {
  os: typeof os;
  http: typeof http;
  storage: typeof pluginStorage;
  event: typeof event;
  session: PluginSessionAPI;
};

export const enums: {
  AppSettingLanguage: typeof AppSettingLanguage;
  AppSettingTheme: typeof AppSettingTheme;
  AppSettingStartupBehavior: typeof AppSettingStartupBehavior;
  CalendarView: typeof CalendarView;
  CalendarWeekStartDay: typeof CalendarWeekStartDay;
  CalendarTimeFormat: typeof CalendarTimeFormat;
  ClipboardDataType: typeof ClipboardDataType;
  AppEventType: typeof AppEventType;
};

export const ui: {
  registerView: (
    viewId: string,
    renderFn: (container: HTMLElement) => void,
  ) => void;
  registerContextMenu: (
    target: string,
    command: string,
    label: string,
    callback: (target: string) => void,
  ) => void;
  /**
   * 설정 모달에 탭을 추가합니다.
   * @param tabId 고유 탭 ID (플러그인 ID와 조합해 `${pluginId}:${tabId}` 형태로 저장됨)
   */
  registerSettingsTab: (
    tabId: string,
    options: RegisterSettingsTabOptions,
  ) => void;
};
