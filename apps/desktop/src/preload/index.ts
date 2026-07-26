import * as Enums from '@croffledev/common';
import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';

import { logger } from '../main/logger';
import { scheduleApi } from './api/calendar/schedules';
import { searchApi } from './api/calendar/search';
import { tagApi } from './api/calendar/tags';
import { eventApi } from './api/event';
import { extensionConfigurationApi } from './api/extensions/configuration';
import { extensionInfoApi } from './api/extensions/info';
import { extensionSessionApi } from './api/extensions/session';
import { extensionStorageApi } from './api/extensions/storage';
import { httpApi } from './api/http';
import { osApi } from './api/os';
import { settingsApi } from './api/settings';
import { windowApi } from './api/window';

const api = {
  window: windowApi,
  os: osApi,
  http: httpApi,
  event: eventApi,
  calendar: {
    schedules: scheduleApi,
    tags: tagApi,
    search: searchApi,
  },
  settings: settingsApi,
  extensions: {
    info: extensionInfoApi,
    configuration: extensionConfigurationApi,
    storage: extensionStorageApi,
    session: extensionSessionApi,
  },
  enums: Enums,
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('croffle', api);
  } catch (error) {
    logger.error('Preload', JSON.stringify(error));
  }
} else {
  window.electron = electronAPI;
  window.croffle = api;
}
