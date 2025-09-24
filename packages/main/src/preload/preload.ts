import { contextBridge, ipcRenderer } from 'electron';
import { IpcHandlers } from '../ipc/ipcHandle';

const electronAPI = {
  // 윈도우 제어
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
} satisfies {
  [K in keyof IpcHandlers]: IpcHandlers[K];
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;
