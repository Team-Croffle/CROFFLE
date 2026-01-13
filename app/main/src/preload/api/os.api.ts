import { ipcRenderer } from 'electron';

export const osApi = {
  os: {
    showNotification: (title: string, body: string) => 
      ipcRenderer.invoke('os:showNotification', title, body),
    getClipboard: () => 
      ipcRenderer.invoke('os:getClipboard'),
    setClipboard: (text: string) => 
      ipcRenderer.invoke('os:setClipboard', text),
  }
};