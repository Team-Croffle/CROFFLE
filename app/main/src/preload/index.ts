import { contextBridge } from 'electron';
import { windowApi } from './api/window.api';

const electronAPI = {
  ...windowApi,
};

export type ElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
