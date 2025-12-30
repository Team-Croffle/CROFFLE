import { AppSettings } from '@croffledev/croffle-common';
import { ipcRenderer } from 'electron';
import { SettingsAPI } from '../../ipc/settings.handler';

export const settingsApi = {
  getAll: async (): Promise<AppSettings> => {
    return ipcRenderer.invoke('settings:getAll');
  },

  getOf: async (key: string): Promise<AppSettings[keyof AppSettings]> => {
    return ipcRenderer.invoke('settings:getOf', key);
  },

  update: async (partialSettings: Partial<AppSettings>): Promise<AppSettings> => {
    return ipcRenderer.invoke('settings:update', partialSettings);
  },
} satisfies SettingsAPI;
