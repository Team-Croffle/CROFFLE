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

export enum ClipboardDataType {
  TEXT = 'text',
  IMAGE = 'image',
  EMPTY = 'empty',
  ERROR = 'error',
}

// IPC Event Types in main process
export enum AppEventType {
  // Schedule
  SCHEDULE_GET = 'schedule:get',
  SCHEDULE_CREATE = 'schedule:create',
  SCHEDULE_UPDATE = 'schedule:update',
  SCHEDULE_DELETE = 'schedule:delete',
  SCHEDULE_EXPORT_TO_FILE = 'schedule:exportToFile',
  SCHEDULE_IMPORT_FROM_FILE = 'schedule:importFromFile',

  // Tag
  TAG_GET = 'tag:getAll',
  TAG_GET_BY_NAME = 'tag:getByName',
  TAG_CREATE = 'tag:create',
  TAG_UPDATE = 'tag:update',
  TAG_DELETE = 'tag:delete',

  // Extension Info
  EXTENSION_INFO_GET_INSTALLED = 'extensionInfo:getInstalled',
  EXTENSION_INFO_GET_ENABLED = 'extensionInfo:getEnabled',
  EXTENSION_INFO_GET_BY_NAME = 'extensionInfo:getByName',
  EXTENSION_INFO_INSTALL = 'extensionInfo:install',
  EXTENSION_INFO_TOGGLE = 'extensionInfo:toggle',
  EXTENSION_INFO_UNINSTALL = 'extensionInfo:uninstall',

  // Extension Storage
  EXTENSION_STORAGE_GET = 'extensionStorage:get',
  EXTENSION_STORAGE_SET = 'extensionStorage:set',
  EXTENSION_STORAGE_DELETE = 'extensionStorage:delete',

  // Settings
  SETTINGS_GET = 'settings:get',
  SETTINGS_GET_OF = 'settings:getOf',
  SETTINGS_UPDATE = 'settings:update',

  // Window
  WINDOW_MINIMIZE = 'window:minimize',
  WINDOW_RESTORE = 'window:restore',
  WINDOW_MAXIMIZE = 'window:maximize',
  WINDOW_CLOSE = 'window:close',
  WINDOW_EXIT = 'window:exit',
  WINDOW_CHECK_FOR_UPDATES = 'window:checkForUpdates',
  WINDOW_SHOW = 'window:show',
  WINDOW_HIDE = 'window:hide',

  // OS Service
  NATIVE_OS_NOTIFICATION = 'nativeOs:notification',
  NATIVE_OS_CLIPBOARD_GET = 'nativeOs:clipboard:get',
  NATIVE_OS_CLIPBOARD_SET = 'nativeOs:clipboard:set',

  // HTTP Service
  HTTP_SERVICE_GET = 'httpService:get',
  HTTP_SERVICE_POST = 'httpService:post',

  // Extension
  EXTENSION_INSTALL = 'extension:install',
  EXTENSION_TOGGLE = 'extension:toggle',
  EXTENSION_UNINSTALL = 'extension:uninstall',

  // Extension Session Storage
  EXTENSION_SESSION_STORAGE_GET = 'sessionStorage:get',
  EXTENSION_SESSION_STORAGE_SET = 'sessionStorage:set',
  EXTENSION_SESSION_STORAGE_DELETE = 'sessionStorage:delete',
  EXTENSION_SESSION_STORAGE_CLEAR = 'sessionStorage:clear',
  EXTENSION_SESSION_STORAGE_CLEAR_ALL = 'sessionStorage:clearAll',

  // Background works
  SCHEDULER_REGISTER = 'scheduler:register',
  SCHEDULER_UNREGISTER = 'scheduler:unregister',

  // UI Extensions
  UI_ADD_MENU_ITEM = 'ui:addMenuItem',
  UI_CONTEXT_MENU_ADD_ITEM = 'ui:contextMenu:addItem',

  // Electron Updater ?�용. ???�에?�만 ?�용
  UPDATE_AVAILABLE = 'update:available',
  UPDATE_NOT_AVAILABLE = 'update:notAvailable',
  UPDATE_DOWNLOAD_PROGRESS = 'update:downloadProgress',
  UPDATE_DOWNLOADED = 'update:downloaded',
  UPDATE_ERROR = 'update:error',
  UPDATE_DOWNLOAD_NOW = 'update:downloadNow',
  UPDATE_DOWNLOAD_LATER = 'update:downloadLater',
  UPDATE_SKIP_THIS_VERSION = 'update:skipThisVersion',
}
