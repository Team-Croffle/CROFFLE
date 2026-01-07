import { ipcRenderer } from 'electron';
import { WindowAPI } from '../../ipc/window.handler';

export const windowApi = {
  // 윈도우 제어
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),

  minimizeToTray: () => ipcRenderer.invoke('window:minimizeToTray'),
  exitApp: () => ipcRenderer.invoke('window:exitApp'),
  checkForUpdates: () => ipcRenderer.invoke('window:checkForUpdates'),
} satisfies WindowAPI;
