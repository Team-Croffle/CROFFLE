import * as Enums from '@croffledev/common';
import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';

import { logger } from '../main/logger';
import { scheduleApi } from './api/calendar/schedules';
import { searchApi } from './api/calendar/search';
import { tagApi } from './api/calendar/tags';
import { eventApi } from './api/event';
import { httpApi } from './api/http';
import { osApi } from './api/os';
import { pluginInfoApi } from './api/plugins/info';
import { pluginSessionApi } from './api/plugins/session';
import { pluginSettingsApi } from './api/plugins/settings';
import { pluginStorageApi } from './api/plugins/storage';
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
  plugins: {
    info: pluginInfoApi,
    settings: pluginSettingsApi,
    storage: pluginStorageApi,
    session: pluginSessionApi,
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
