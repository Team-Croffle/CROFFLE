export declare enum AppEventType {
  SCHEDULE_GET = 'schedule:get',
  SCHEDULE_CREATE = 'schedule:create',
  SCHEDULE_UPDATE = 'schedule:update',
  SCHEDULE_DELETE = 'schedule:delete',
  SCHEDULE_EXPORT_TO_FILE = 'schedule:exportToFile',
  SCHEDULE_IMPORT_FROM_FILE = 'schedule:importFromFile',

  TAG_GET = 'tag:getAll',
  TAG_GET_BY_NAME = 'tag:getByName',
  TAG_CREATE = 'tag:create',
  TAG_UPDATE = 'tag:update',
  TAG_DELETE = 'tag:delete',

  PLUGIN_INFO_GET_INSTALLED = 'pluginInfo:getInstalled',
  PLUGIN_INFO_GET_ENABLED = 'pluginInfo:getEnabled',
  PLUGIN_INFO_GET_BY_NAME = 'pluginInfo:getByName',
  PLUGIN_INFO_INSTALL = 'pluginInfo:install',
  PLUGIN_INFO_TOGGLE = 'pluginInfo:toggle',
  PLUGIN_INFO_UNINSTALL = 'pluginInfo:uninstall',

  PLUGIN_STORAGE_GET = 'pluginStorage:get',
  PLUGIN_STORAGE_SET = 'pluginStorage:set',
  PLUGIN_STORAGE_DELETE = 'pluginStorage:delete',

  SETTINGS_GET = 'settings:get',
  SETTINGS_GET_OF = 'settings:getOf',
  SETTINGS_UPDATE = 'settings:update',

  WINDOW_MINIMIZE = 'window:minimize',
  WINDOW_RESTORE = 'window:restore',
  WINDOW_MAXIMIZE = 'window:maximize',
  WINDOW_CLOSE = 'window:close',
  WINDOW_EXIT = 'window:exit',
  WINDOW_CHECK_FOR_UPDATES = 'window:checkForUpdates',
  WINDOW_SHOW = 'window:show',
  WINDOW_HIDE = 'window:hide',

  NATIVE_OS_NOTIFICATION = 'nativeOs:notification',
  NATIVE_OS_CLIPBOARD_GET = 'nativeOs:clipboard:get',
  NATIVE_OS_CLIPBOARD_SET = 'nativeOs:clipboard:set',

  HTTP_SERVICE_GET = 'httpService:get',
  HTTP_SERVICE_POST = 'httpService:post',

  PLUGIN_INSTALL = 'plugin:install',
  PLUGIN_TOGGLE = 'plugin:toggle',
  PLUGIN_UNINSTALL = 'plugin:uninstall',

  PLUGIN_SESSION_STORAGE_GET = 'sessionStorage:get',
  PLUGIN_SESSION_STORAGE_SET = 'sessionStorage:set',
  PLUGIN_SESSION_STORAGE_DELETE = 'sessionStorage:delete',
  PLUGIN_SESSION_STORAGE_CLEAR = 'sessionStorage:clear',
  PLUGIN_SESSION_STORAGE_CLEAR_ALL = 'sessionStorage:clearAll',

  SCHEDULER_REGISTER = 'scheduler:register',
  SCHEDULER_UNREGISTER = 'scheduler:unregister',

  UI_ADD_MENU_ITEM = 'ui:addMenuItem',
  UI_CONTEXT_MENU_ADD_ITEM = 'ui:contextMenu:addItem',

  UPDATE_AVAILABLE = 'update:available',
  UPDATE_NOT_AVAILABLE = 'update:notAvailable',
  UPDATE_DOWNLOAD_PROGRESS = 'update:downloadProgress',
  UPDATE_DOWNLOADED = 'update:downloaded',
  UPDATE_ERROR = 'update:error',
  UPDATE_DOWNLOAD_NOW = 'update:downloadNow',
  UPDATE_DOWNLOAD_LATER = 'update:downloadLater',
  UPDATE_SKIP_THIS_VERSION = 'update:skipThisVersion',
}
