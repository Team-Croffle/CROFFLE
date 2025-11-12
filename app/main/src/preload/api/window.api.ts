import { ipcRenderer } from 'electron';
import { WindowAPI } from '../../ipc/window.handler';

export const windowApi = {
  // 윈도우 제어
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
} satisfies WindowAPI;
