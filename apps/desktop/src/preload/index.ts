import * as Enums from '@croffledev/shared';
import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';

import { logger } from '../main/logger';
import { eventApi } from './api/event.api';
import { httpApi } from './api/http.api';
import { osApi } from './api/os.api';
import { pluginInfoApi } from './api/plugin-info.api';
import { pluginSessionApi } from './api/plugin-session.api';
import { pluginSettingsApi } from './api/plugin-settings.api';
import { pluginStorageApi } from './api/plugin-storage.api';
import { scheduleApi } from './api/schedule.api';
import { searchApi } from './api/search.api';
import { settingsApi } from './api/settings.api';
import { tagApi } from './api/tag.api';
import { windowApi } from './api/window.api';

// Custom APIs for renderer
const api = {
  base: {
    windows: windowApi,
    tags: tagApi,
    schedules: scheduleApi,
    pluginInfo: pluginInfoApi,
    settings: settingsApi,
    pluginSettings: pluginSettingsApi,
    search: searchApi,
  },
  app: {
    os: osApi,
    http: httpApi,
    storage: pluginStorageApi,
    event: eventApi,
    session: pluginSessionApi,
  },

  enums: Enums,
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('croffle', api);
  } catch (error) {
    logger.error('Preload', JSON.stringify(error));
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.croffle = api;
}
