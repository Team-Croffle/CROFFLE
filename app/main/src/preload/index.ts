import { contextBridge } from 'electron';
import { windowApi } from './api/window.api';
import { tagApi } from './api/tag.api';
import { scheduleApi } from './api/schedule.api';

const electronAPI = {
  ...windowApi,
  ...tagApi,
  ...scheduleApi,
};

export type ElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
