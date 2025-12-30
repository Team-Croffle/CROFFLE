import { contextBridge } from 'electron';
import { windowApi } from './api/window.api';
import { tagApi } from './api/tag.api';
import { pluginInfoApi } from './api/pluginInfo.api';
import { settingsApi } from './api/settings.api';

const electronAPI = {
  ...windowApi,
  ...tagApi,
  ...pluginInfoApi,
  ...settingsApi,
};

export type ElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
