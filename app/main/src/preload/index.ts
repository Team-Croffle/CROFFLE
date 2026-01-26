import { contextBridge } from 'electron';
import { windowApi } from './api/window.api';
import { tagApi } from './api/tag.api';
import { pluginInfoApi } from './api/pluginInfo.api';
import { settingsApi } from './api/settings.api';
import { scheduleApi } from './api/schedule.api';
import { httpApi } from './api/http.api';

const electronAPI = {
  ...windowApi,
  ...tagApi,
  ...pluginInfoApi,
  ...settingsApi,
  ...scheduleApi,
  ...httpApi,
};

export type ElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
